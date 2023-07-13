import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

function initialize(api) {
  const enabledCategories = settings.consent_enabled_categories
    .split("|")
    .map((id) => parseInt(id, 10));
  const uploadRegexp = /\(upload?:\/\/[\w\d./?=#]+\)/;

  api.modifyClass("controller:composer", {
    pluginId: "discourse-upload-consent",

    savePost() {
      this.save(false, {
        jump: !this.model.replyingToTopic && !this.skipJumpOnSave,
      });
    },

    actions: {
      save() {
        if (
          enabledCategories.includes(this.model.categoryId) &&
          uploadRegexp.test(this.model.reply)
        ) {
          showModal("upload-consent-modal", {
            model: {
              savePost: this.savePost.bind(this),
            },
          });
        } else {
          this.savePost();
        }
      },
    },
  });
}

export default {
  name: "discourse-upload-consent",

  initialize() {
    withPluginApi("1.2.0", initialize);
  },
};
