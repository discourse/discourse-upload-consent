import { withPluginApi } from "discourse/lib/plugin-api";
import { inject as service } from "@ember/service";
import UploadConsent from "../components/modal/upload-consent";

const uploadRegexp = /\(upload?:\/\/[\w\d./?=#]+\)/;

function initialize(api) {
  api.modifyClass("service:composer", {
    pluginId: "discourse-upload-consent",

    modal: service(),

    save() {
      const enabledCategories = settings.consent_enabled_categories
        .split("|")
        .map((id) => parseInt(id, 10));

      if (
        enabledCategories.includes(this.model.categoryId) &&
        uploadRegexp.test(this.model.reply)
      ) {
        const originalSave = this._super;
        this.modal.show(UploadConsent, {
          model: {
            savePost: () => {
              originalSave.call(this, false, {
                jump: !this.model.replyingToTopic && !this.skipJumpOnSave,
              });
            },
          },
        });
      } else {
        this._super(...arguments);
      }
    },
  });
}

export default {
  name: "discourse-upload-consent",

  initialize() {
    withPluginApi("1.2.0", initialize);
  },
};
