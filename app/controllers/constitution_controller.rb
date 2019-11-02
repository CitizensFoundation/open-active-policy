# coding: utf-8

# Copyright (C) 2010-2019 Íbúar ses / Citizens Foundation Iceland
# Authors Robert Bjarnason, Gunnar Grimsson, Gudny Maren Valsdottir & Alexander Mani Gautason
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

require 'digest/sha1'
require 'nokogiri'
require 'base64'
require 'ruby-saml'

DSIG = "http://www.w3.org/2000/09/xmldsig#"

class ConstitutionController < ApplicationController

  before_action :log_session_id

  # Logout and reset the session
  def logout
    Rails.logger.info("Logout")
    reset_session
  end

  # Send the config and public key to the client app
  def boot
    respond_to do |format|

      locale = params[:locale]
      data = @config.client_config
      not_used_languages = []
      data['languages'].each do |key, child|
        puts key
        if key!=locale
          not_used_languages.push(key)
        end
      end
      not_used_languages.each do |not_used|
        data['languages'][not_used]=nil
      end

      @config.client_config = data

      format.json { render :json => { :config => @config, :public_key => @public_key } }
    end
  end

  # Used for BOTs to show dynamic meta data
  def meta
    @meta = @config.client_config["shareMetaData"]
    respond_to do |format|
      format.html
    end
  end

  # Encrypted vote posted by the user
  def post_vote

    # Try to read the vote identity and redirect to authentication error if not found
    if request.session_options[:id]

      # Hide IP address if needed
      ip_address = DO_NOT_LOG_IP_ADDRESSES == false ? request.remote_ip : "n/a"

      # Save the vote to the database as not authenticated
      if vote = Constitution.create(:user_id_hash => "not authenticated",
                     :payload_data => params[:encrypted_vote],
                     :client_ip_address => ip_address,
                     :area_id =>params[:area_id],
                     :saml_assertion_id=> ENV["FAKE_VOTING"] ? "fake" : nil,
                     :session_id => request.session_options[:id],
                     :encrypted_vote_checksum => "not authenticated")

        Rails.logger.info("Saved vote for session id: #{request.session_options[:id]}")
        response = {:error=>false, :vote_ok=>true, :vote_id=>vote.id}
      else
        Rails.logger.error("Could not save vote for session id: #{request.session_options[:id]}")
        response = {:error=>true, :vote_ok=>false}
      end
    else
      Rails.logger.error("No session id")
      response = {:error=>true, :vote_ok=>false}
    end

    respond_to do |format|
      format.json { render :json => response }
    end
  end

  private

  def log_session_id
    Rails.logger.info("Session id: #{request.session.id}")
  end
end