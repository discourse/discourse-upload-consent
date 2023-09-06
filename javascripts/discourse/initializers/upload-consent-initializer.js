import { withPluginApi } from "discourse/lib/plugin-api";
import UploadConsent from "../components/modal/upload-consent";
import { Promise } from "rsvp";

const uploadRegexp = /\(upload?:\/\/[\w\d./?=#]+\)/;

function initialize(api) {
  const composerService = api.container.lookup("service:composer");
  const modal = api.container.lookup("service:modal");

  const enabledCategories = settings.consent_enabled_categories
    .split("|")
    .map((id) => parseInt(id, 10));

  api.composerBeforeSave(() => {
    const categoryId = composerService.model?.categoryId;
    const reply = composerService.model?.reply;

    if (!categoryId || !reply) {
      return Promise.resolve();
    }

    if (!enabledCategories.includes(categoryId) || !uploadRegexp.test(reply)) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      modal.show(UploadConsent, {
        model: {
          savePost: resolve,
        },
      });
    });
  });
}

export default {
  name: "discourse-upload-consent",

  initialize() {
    withPluginApi("1.2.0", initialize);
  },
};
