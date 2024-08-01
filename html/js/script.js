var cancelledTimer = null;

$("document").ready(function () {
  Progressbar = {};

  Progressbar.Progress = function (data) {
    clearTimeout(cancelledTimer);
    $("#progress-label").text(data.label);
    $("#total-time").text((data.duration / 1000).toFixed(0));

    if (data.canCancel == false) {
      $(".progress-bar-adit-info").show();
    } else {
      $(".progress-bar-adit-info").hide();
    }

    $(".progress-container").fadeIn("fast", function () {
      $("#progress-bar")
        .stop()
        .css({ width: 0, "background-color": "#38a2e5" })
        .animate(
          {
            width: "100%",
          },
          {
            duration: parseInt(data.duration),
            complete: function () {
              $(".progress-container").fadeOut("fast", function () {
                $("#progress-bar").removeClass("cancellable");
                $("#progress-bar").css("width", 0);
                $.post("https://progressbar/FinishAction", JSON.stringify({}));
              });
            },
            progress: function (promise, progress, remainingMs) {
              $("#current-time").text(
                ((data.duration - remainingMs) / 1000).toFixed(0)
              );
            },
          }
        );
    });
  };

  Progressbar.ProgressCancel = function () {
    $("#progress-label").text("CANCELLED");
    $("#progress-bar")
      .stop()
      .css({ width: "100%", "background-color": "rgba(255, 0, 0, 0.8)" });
    $("#progress-bar").removeClass("cancellable");

    cancelledTimer = setTimeout(function () {
      $(".progress-container").fadeOut("fast", function () {
        $("#progress-bar").css("width", 0);
        $.post("https://progressbar/CancelAction", JSON.stringify({}));
      });
    }, 1000);
  };

  Progressbar.CloseUI = function () {
    $(".main-container").fadeOut("fast");
  };

  window.addEventListener("message", function (event) {
    switch (event.data.action) {
      case "progress":
        Progressbar.Progress(event.data);
        break;
      case "cancel":
        Progressbar.ProgressCancel();
        break;
    }
  });
});
