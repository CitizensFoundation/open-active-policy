# Copyright (C) 2010-2018 Íbúar ses / Citizens Foundation Iceland
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

class Constitution < ActiveRecord::Base
  @@public_key = nil
  attr_accessor :generated_vote_checksum # Used for testing purposes only as this generated checksum is transferred over to the final_split_vote before counting

  def self.generate_encrypted_checksum(voter_identity_hash,payload_data,remote_ip,area_id,session_id)
    # Create an encrypted checksum for voter id, encrypted ballot data, remote ip, area and session ids.
    @@public_key =  OpenSSL::PKey::RSA.new(BudgetConfig.current.public_key)
    vote_checksum = Vote.generate_checksum(voter_identity_hash,payload_data,remote_ip,area_id,session_id)
    Rails.logger.info("Public key: #{@@public_key} Checksum: #{vote_checksum}")
    encrypted = Base64.encode64(@@public_key.public_encrypt(vote_checksum))
    encrypted.length
    encrypted
  end

  def self.generate_checksum(voter_identity_hash,payload_data,remote_ip,area_id,session_id)
    # Create a SHA1 checksum for voter id, encrypted ballot data, remote ip, area and session ids.
    Digest::SHA1.hexdigest [voter_identity_hash,payload_data,remote_ip,area_id,session_id].join(" ")
  end
end
