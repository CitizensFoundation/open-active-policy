import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import { ypMediaFormatsBehavior } from './yp-media-formats-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ypLocalizationBridgeBehavior } from './yp-localization-bridge-behavior.js';

Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      iron-image {
        display: block;
        vertical-align: text-top;
        height: 48px;
        width: 48px;
      }

      .small {
        height: 30px;
        width: 30px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .large {
        height: 90px;
        width: 90px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .veryLarge {
        height: 200px;
        width: 200px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .medium {
        height: 48px;
        width: 48px;
        background-color: var(--primary-color-lighter,#434343);
      }

      .rounded {
        -webkit-border-radius: 25px;
        -moz-border-radius: 25px;
        border-radius: 25px;
        display: block;
        -webkit-transform-style: preserve-3d;
      }

      .rounded-more {
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        display: block;
        vertical-align: top;
        align: top;
        -webkit-transform-style: preserve-3d;
      }

      .rounded-even-more {
        -webkit-border-radius: 115px;
        -moz-border-radius: 125px;
        border-radius: 125px;
        display: block;
        vertical-align: top;
        align: top;
        -webkit-transform-style: preserve-3d;
      }

      .rounded img { opacity: 0; }

      .rounded-more img { opacity: 0; }

      [hidden] {
        display: none !important;
      }
    </style>

    <template restamp="" is="dom-if" if="[[user]]">
      <template is="dom-if" if="[[profileImageUrl]]">
        <iron-image sizing="cover" title="[[userTitle]]" preload="" src="[[profileImageUrl]]" class\$="[[computeClass(small)]]"></iron-image>
      </template>

      <template is="dom-if" if="[[noProfileImage]]" restamp="">
        <template is="dom-if" if="[[user.facebook_id]]">
          <iron-image sizing="cover" hidden\$="[[profileImageUrl]]" title="[[userTitle]]" preload="" src\$="[[computeFacebookSrc]]" class\$="[[computeClass(small)]]"></iron-image>
        </template>

        <template is="dom-if" if="[[!noDefault]]">
          <template is="dom-if" if="[[!user.facebook_id]]">
            <iron-image sizing="cover" title="[[userTitle]]" preload="" src="https://s3.amazonaws.com/better-reykjavik-paperclip-production/instances/buddy_icons/000/000/001/icon_50/default_profile.png" class\$="[[computeClass(small)]]"></iron-image>
          </template>
        </template>

      </template>

    </template>
`,

  is: 'yp-user-image',

  behaviors: [
    ypMediaFormatsBehavior,
    ypLocalizationBridgeBehavior
  ],

  properties: {
    small: {
      type: Boolean,
      value: false
    },

    large: {
      type: Boolean,
      value: false
    },

    veryLarge: {
      type: Boolean,
      value: false
    },

    titleFromUser: {
      type: String
    },

    userTitle: {
      type: String,
      computed: '_computeUserTitle(user, title)'
    },

    user: {
      type: Object
    },

    profileImageUrl: {
      type: String,
      computed: '_profileImageUrl(user)'
    },

    noDefault: {
      type: Boolean,
      value: false
    },

    computeFacebookSrc: {
      type: String,
      computed: '_computeFacebookSrc(user)'
    },

    noProfileImage: {
      type: Boolean,
      value: false
    }
  },

  _computeUserTitle: function (user, titleFromUser) {
    if (user) {
      if (titleFromUser) {
        return titleFromUser;
      } else {
        return user.name;
      }
    } else {
      return "";
    }
  },

  _profileImageUrl: function (user) {
    if (user && user.UserProfileImages && user.UserProfileImages.length > 0) {
      var formatUrl = this.getImageFormatUrl(user.UserProfileImages, 0);
      if (formatUrl && formatUrl!=="") {
        this.set('noProfileImage', false);
        return formatUrl;
      } else {
        this.set('noProfileImage', true);
        return null;
      }
    } else {
      this.set('noProfileImage', true);
      return null;
    }
  },

  computeIf: function (user) {
    return false && !user.facebook_id && user.buddy_icon_file_name;
  },

  computeClass: function (small) {
    if (this.small)
      return 'small rounded';
    else if (this.large)
      return 'large rounded-more';
    else if (this.veryLarge)
      return 'veryLarge rounded-even-more';
    else
      return 'medium rounded';
  },

  _computeFacebookSrc: function (user) {
    if (user && user.facebook_id) {
      return 'https://graph.facebook.com/' + user.facebook_id + '/picture';
    } else {
      return null;
    }
  },

  usePlaceHolderImage: function (user) {
    (this.profileImageUrl==null && user.facebook_id==null)
  },

  ready: function () {
  }
});
