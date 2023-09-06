import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { later } from "@ember/runloop";
export default class UploadConsent extends Component {
  @tracked showError = false;

  @action
  save() {
    this.args.model?.savePost();
    this.args.closeModal();
  }

  @action
  cancel() {
    this.showError = true;
  }
}
