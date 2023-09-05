import { withPluginApi } from "discourse/lib/plugin-api";
import UploadConsent from "../components/modal/upload-consent";

const uploadRegexp = /\(upload?:\/\/[\w\d./?=#]+\)/;
import { Promise } from "rsvp";

function initialize(api) {
  const composerService = api.container.lookup("service:composer");
  const modal = api.container.lookup("service:modal");

  const enabledCategories = settings.consent_enabled_categories
    .split("|")
    .map((id) => parseInt(id, 10));

  api.composerBeforeSave(async () => {
    const categoryId = composerService.model?.categoryId;
    const reply = composerService.model?.reply;

    if (!categoryId || !reply) {
      return;
    }

    if (!enabledCategories.includes(categoryId) || !uploadRegexp.test(reply)) {
      return;
    }

    await modal.show(UploadConsent);
  });
}

export default {
  name: "discourse-upload-consent",

  initialize() {
    withPluginApi("1.2.0", initialize);
  },
};
