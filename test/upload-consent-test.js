import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";
import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import I18n from "discourse-i18n";

acceptance("Upload consent - On non-specified categories", function (needs) {
  needs.user();

  needs.hooks.beforeEach(function () {
    settings.consent_enabled_categories = "20";
  });

  needs.pretender((server, helper) => {
    server.post("/uploads/lookup-urls", () => {
      return helper.response([]);
    });
  });

  test("pop up not shown in this category", async function (assert) {
    await visit("/t/internationalization-localization/280");
    await click("#topic-footer-buttons button.create");
    await fillIn(
      ".d-editor-input",
      "this is the *content* of a post ![719fe171-a783-4aae-9fda-bdd9933d9ae4|500x500](upload://kEpJKAByG5mVRsx6d9UW8IQ6Agf.png)"
    );

    assert.dom(".topic-post").exists({ count: 20 }, "There are 20 posts");
    assert.dom(".modal.upload-consent").doesNotExist("modal is not shown");

    await click("#reply-control button.create");
    assert.dom(".topic-post").exists({ count: 21 }, "post created");
  });
});

acceptance("Upload consent - On specified categories", function (needs) {
  needs.user();

  needs.hooks.beforeEach(function () {
    settings.consent_enabled_categories = "2";

    this._locale = I18n.locale;
    I18n.locale = "fr";

    // e.g. `theme_translations.15.`
    const themeId = themePrefix("").split(".")[1];

    this._translations = I18n.translations;
    I18n.translations = {
      fr: {
        js: {
          theme_translations: {
            [themeId]: {
              discourse_upload_consent: {
                modal: {
                  body: "The notice contents",
                },
              },
            },
          },
        },
      },
    };
  });

  needs.hooks.afterEach(function () {
    I18n.locale = this._locale;
    I18n.translations = this._translations;
  });

  needs.pretender((server, helper) => {
    server.post("/uploads/lookup-urls", () => {
      return helper.response([]);
    });
  });

  test("pop up not shown if reply doesn't contain an upload", async function (assert) {
    await visit("/t/internationalization-localization/280");
    await click("#topic-footer-buttons button.create");
    await fillIn(".d-editor-input", "this is the *content* of a post");

    assert.dom(".topic-post").exists({ count: 20 }, "There are 20 posts");
    assert.dom(".modal.upload-consent").doesNotExist("modal is not shown");

    await click("#reply-control button.create");
    assert.dom(".topic-post").exists({ count: 21 }, "post created");
  });

  test("show popup if reply contains an upload", async function (assert) {
    await visit("/t/internationalization-localization/280");
    await click("#topic-footer-buttons button.create");
    await fillIn(
      ".d-editor-input",
      "this is the *content* of a post ![719fe171-a783-4aae-9fda-bdd9933d9ae4|500x500](upload://kEpJKAByG5mVRsx6d9UW8IQ6Agf.png)"
    );
    assert.dom(".topic-post").exists({ count: 20 }, "there are 20 posts");

    await click("#reply-control button.create");
    assert.dom(".modal.upload-consent").exists("modal is up");
    assert.dom(".topic-post").exists({ count: 20 }, "posts are still 20");
    assert.dom(".consent-content").hasText("The notice contents");

    await click(".modal.upload-consent button.cancel");
    assert
      .dom(".d-modal__body .alert-error")
      .exists("show error Message if user disagrees");

    await click(".modal.upload-consent button.btn-primary");
    assert
      .dom(".topic-post")
      .exists({ count: 21 }, "user grants consent - post is created");
  });
});
