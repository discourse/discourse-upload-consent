import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

const enabledCategories = settings.consent_enabled_categories
  .split("|")
  .map((id) => parseInt(id, 10));
const uploadRegexp = /\(upload?:\/\/[\w\d./?=#]+\)/;

function initialize(api) {
  api.modifyClass("controller:basic-modal-body", {
    showError: false,
    actions: {
      save() {
        this.model.savePost();
        this.send("closeModal");
      },
      cancel() {
        this.set("showError", true);
      },
    },
  });
  api.modifyClass("controller:composer", {
    savePost() {
      this.save(false, {
        jump:
          !(event?.shiftKey && this.get("model.replyingToTopic")) &&
          !this.skipJumpOnSave,
      });
    },
    actions: {
      save(ignore, event) {
        if (
          enabledCategories.includes(this.model.categoryId) &&
          uploadRegexp.test(this.model.reply)
        ) {
          showModal("upload-consent", {
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
