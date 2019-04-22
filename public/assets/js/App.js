$(document).ready(function () {
  $("#load").on("click", function (event) {
    $.get("/all", function (data) {
    });
  });

  $(".save").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    var stringId = $(this).attr('id').split('-');
    var title = stringId[0];
    var link = stringId[1];
    var newSave = {
      title: title,
      link: link
    };
    // Send the POST request.
    $.ajax("/save", {
      type: "POST",
      data: newSave
    })
  });

  $(".submit").on("click", function (event) {
    debugger;
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    var stringId = $(this).attr('id').split('+');
    var title = stringId[0];
    var id = stringId[2];

    var notes = $("#text_" + id).val();
    console.log(notes);
    var link = stringId[1];
    var newSave = {
      title: title,
      link: link,
      notes: notes
    };
    // Send the POST request.
    $.ajax("/update", {
      type: "POST",
      data: newSave
    }).then(function (result) {
      location.reload();
    });
  });

  $(".delete").on("click", function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();
    var stringId = $(this).attr('id').split('-');
    var title = stringId[0];
    var link = stringId[1];
    var newSave = {
      title: title,
      link: link
    };
    // Send the POST request.
    $.ajax("/delete", {
      type: "POST",
      data: newSave
    }).then(function (result) {
      location.reload();
    });
  });

  $("#loadS").on("click", function (event) {
    $.get("/saved", function (data) {
    });
  });
});
