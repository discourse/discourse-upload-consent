import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import CookText from "discourse/components/cook-text";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import icon from "discourse/helpers/d-icon";
import { i18n } from "discourse-i18n";

export default class UploadConsent extends Component {
  @tracked showError = false;

  @action
  save() {
    this.args.closeModal();
  }

  @action
  cancel() {
    this.showError = true;
  }

  <template>
    <DModal
      @closeModal={{@closeModal}}
      @title={{i18n (themePrefix "discourse_upload_consent.modal.title")}}
      class="upload-consent"
    >
      <:body>
        <div class="details">
          {{#if this.showError}}
            <div class="alert alert-error">
              {{icon "triangle-exclamation"}}
              {{i18n
                (themePrefix "discourse_upload_consent.modal.disagree_error")
              }}
            </div>
          {{/if}}

          <div class="content consent-content">
            <CookText
              @rawText={{i18n
                (themePrefix "discourse_upload_consent.modal.body")
              }}
            />
          </div>
        </div>
      </:body>

      <:footer>
        <DButton
          class="btn-primary pull-right"
          @action={{this.save}}
          @translatedLabel={{i18n
            (themePrefix "discourse_upload_consent.modal.save")
          }}
        />

        <DButton
          class="cancel"
          @action={{this.cancel}}
          @translatedLabel={{i18n
            (themePrefix "discourse_upload_consent.modal.cancel")
          }}
        />
      </:footer>
    </DModal>
  </template>
}
