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

class ConstitutionsController < ApplicationController

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

  def review
      browser = Browser.new(
        request.user_agent,
        accept_language: request.env["HTTP_ACCEPT_LANGUAGE"]
    )

    @constitution = Constitution.find(params[:id])

    plain = Base64.decode64(@constitution.payload_data)
    @data = JSON.parse(plain)

    client_config = @config.client_config
    puts client_config["localeSetup"][0]["locale"]
    locale = client_config["localeSetup"][0]["locale"]
    if params[:locale]
      locale = params[:locale]
    end
    if @config.client_config["languages"][locale] and  @config.client_config["languages"][locale]["shareMetaData"]
      @meta = @config.client_config["languages"][locale]["shareMetaData"]
    else
      @meta = @config.client_config["languages"]["en"]["shareMetaData"]
    end

    puts @data

    if browser.bot?
      respond_to do |format|
        format.html { render :layout => false }
      end
    else
      respond_to do |format|
        format.json { render :json => { :constitution => @data } }
      end
    end
  end

  # Used for BOTs to show dynamic meta data
  def meta
    locale = @config.client_config["localeSetup"]["locale"]
    if params[:locale]
      locale = params[:locale]
    end
    if @config.client_config["languages"][locale] and  @config.client_config["languages"][locale]["shareMetaData"]
      @meta = @config.client_config["languages"][locale]["shareMetaData"]
    else
      @meta = @config.client_config["languages"]["en"]["shareMetaData"]
    end
    respond_to do |format|
      format.html
    end
  end

  def get_constitution
    constitution = Constitution.find(params[:id])
    respond_to do |format|
      format.json { render :json => { :constitution => constitution.payload_data } }
    end
  end

  # Encrypted constitution posted by the user
  def post_constitution

    # Try to read the constitution identity and redirect to authentication error if not found
    if request.session_options[:id]

      # Hide IP address if needed
      ip_address = DO_NOT_LOG_IP_ADDRESSES == false ? request.remote_ip : "n/a"

      # Save the constitution to the database as not authenticated
      if constitution = Constitution.create(:user_id_hash => "not authenticated",
                     :payload_data => params[:encrypted_vote],
                     :client_ip_address => ip_address,
                     :area_id =>1,
                     :saml_assertion_id=> ENV["FAKE_VOTING"] ? "fake" : nil,
                     :session_id => request.session_options[:id],
                     :encrypted_vote_checksum => "not authenticated")

        Rails.logger.info("Saved constitution for session id: #{request.session_options[:id]}")
        response = {:error=>false, :constitution_ok=>true, :constitution_id=>constitution.id}
      else
        Rails.logger.error("Could not save constitution for session id: #{request.session_options[:id]}")
        response = {:error=>true, :constitution_ok=>false}
      end
    else
      Rails.logger.error("No session id")
      response = {:error=>true, :constitution_ok=>false}
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
