import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import { click, fillIn, visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Upload consent - On non-specified categories", function (needs) {
  needs.user();

  needs.hooks.beforeEach(() => {
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

    assert.equal(
      document.querySelectorAll(".topic-post").length,
      20,
      "There are 20 posts"
    );
    assert.notOk(
      document.querySelector("#discourse-modal.in"),
      "modal is not shown"
    );

    await click("#reply-control button.create");

    assert.equal(
      document.querySelectorAll(".topic-post").length,
      21,
      "post created"
    );
  });
});

acceptance("Upload consent - On specified categories", function (needs) {
  needs.user();

  needs.hooks.beforeEach(() => {
    settings.consent_enabled_categories = "2";
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

    assert.equal(
      document.querySelectorAll(".topic-post").length,
      20,
      "There are 20 posts"
    );
    assert.notOk(
      document.querySelector("#discourse-modal.in"),
      "modal is not shown"
    );

    await click("#reply-control button.create");

    assert.equal(
      document.querySelectorAll(".topic-post").length,
      21,
      "post created"
    );
  });

  test("show popup if reply contains an upload", async function (assert) {
    await visit("/t/internationalization-localization/280");
    await click("#topic-footer-buttons button.create");
    await fillIn(
      ".d-editor-input",
      "this is the *content* of a post ![719fe171-a783-4aae-9fda-bdd9933d9ae4|500x500](upload://kEpJKAByG5mVRsx6d9UW8IQ6Agf.png)"
    );
    assert.equal(
      document.querySelectorAll(".topic-post").length,
      20,
      "there are 20 posts"
    );
    await click("#reply-control button.create");
    assert.ok(document.querySelector("#discourse-modal.in"), "modal is up");
    assert.equal(
      document.querySelectorAll(".topic-post").length,
      20,
      "posts are still 20"
    );

    await click("#discourse-modal button.cancel");
    assert.ok(
      document.querySelector(".modal-body .alert-error"),
      "show error Message if user disagrees"
    );

    await click("#discourse-modal button.btn-primary");
    assert.equal(
      document.querySelectorAll(".topic-post").length,
      21,
      "user grants consent - post is created."
    );
  });
});
