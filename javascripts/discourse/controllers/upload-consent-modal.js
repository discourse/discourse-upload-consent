import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import { action } from "@ember/object";

export default Controller.extend(ModalFunctionality, {
  showError: false,

  @action
  save() {
    this.model.savePost();
    this.send("closeModal");
  },

  @action
  cancel() {
    this.set("showError", true);
  },

  onShow() {
    this.set("showError", false);
  },
});
