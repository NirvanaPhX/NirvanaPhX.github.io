$(() => {
  var $searchClient = $("#searchClient");
  const path = "./rentalclients.json";
  var $displayResult = $("#displayResult");
  var list;
  var template = $("#tpl").html();
  var selectedID;

  ObtainData(path);

  $searchClient.on("focus", () => {
    $displayResult.empty();
    disableForm();
  });

  $searchClient.on("keyup", () => {
    $displayResult.empty();
    if ($("#searchClient").val() !== "") {
      $.each(list, (index, value) => {
        if (value.last_name.includes($searchClient.val())) {
          addEntry(value);
        }
      });
      document.querySelectorAll(".card").forEach((value) => {
        value.onclick = () => {
          $searchClient[0].value = "";

          // Give the global variable the id being clicked
          selectedID = value.id;
          // Use that id to find the object in the list and render it
          populateForm(list[value.id]);

          // Added some animation to show the form
          $("#clientForm").animate({ opacity: 0.9 });

          // Enable Editing of the form
          enableForm();

          // Clear the area where all the clients has been shown
          $displayResult.empty();
        };
      });
    }
  });

  $("#clientForm").on("submit", () => {
    displayBill();
  });

  $("#clear").on("click", () => {
    $displayResult.empty();
  });

  function ObtainData($url) {
    $.ajax({
      type: "GET",
      url: $url,
      success: function (data) {
        console.log("Data successfully loaded");
        $.each(data, () => {
          list = data;
        });
        for (var i = 0; i < list.length; i++) {
          list[i].id = i;
        }
        console.log(list);
      },
      // Handle Unexpeted AJAX failure
      error: () => {
        console.log("Something went wrong.");
      },
      statusCode: {
        // Handle 400 and 500 errors
        404: () => {
          console.log("page not found");
        },
        500: () => {
          console.log("Server Error");
        },
      },
    });
  }

  function addEntry(entry) {
    $displayResult.append(Mustache.render(template, entry));
  }

  function populateForm(object) {
    $("#fname")[0].value = object.first_name;
    $("#lname")[0].value = object.last_name;
    $("#address")[0].value = object.address;
    $("#state_prov")[0].value = object.state_prov;
    $("#email")[0].value = object.email;
    $("#tel")[0].value = object.phone;
  }

  function enableForm() {
    $("#fname")[0].disabled = false;
    $("#lname")[0].disabled = false;
    $("#address")[0].disabled = false;
    $("#state_prov")[0].disabled = false;
    $("#email")[0].disabled = false;
    $("#tel")[0].disabled = false;
    $("#vehicleType")[0].disabled = false;
    $("#rack")[0].disabled = false;
    $("#gps")[0].disabled = false;
    $("#childSeat")[0].disabled = false;
    $("#length")[0].disabled = false;
  }

  function disableForm() {
    $("#fname")[0].disabled = true;
    $("#lname")[0].disabled = true;
    $("#address")[0].disabled = true;
    $("#state_prov")[0].disabled = true;
    $("#email")[0].disabled = true;
    $("#tel")[0].disabled = true;
    $("#vehicleType")[0].disabled = true;
    $("#rack")[0].disabled = true;
    $("#gps")[0].disabled = true;
    $("#childSeat")[0].disabled = true;
    $("#length")[0].disabled = true;
  }

  function calculateForm() {
    var vehicleType = $("#vehicleType").val();
    var total = 0;
    var dailyPrice = 35;
    var length;

    // Get daily price of the rental
    switch (vehicleType) {
      case "compact":
        dailyPrice = 15;
        break;
      case "midSize":
        dailyPrice = 20;
        break;
      case "luxury":
        dailyPrice = 35;
        break;
      case "van":
        dailyPrice = 40;
        break;
      default:
        dailyPrice = 0;
    }

    // Get rental lenth
    length = $("#length").val();

    // Get Extra items needed for the rental
    if (document.getElementById("rack").checked) {
      total += 5 * length;
    }
    if (document.getElementById("gps").checked) {
      total += 10;
    }

    // Calculate Total
    total += length * dailyPrice;
    return total;
  }

  function displayBill() {
    $("#displayResult").empty();

    var selectedObject = list[selectedID];
    var total = calculateForm();

    HTMLfragment = `
    <div class="container" id="bill">
        <div class='form-control'>
            <h2 class="underline">Client Information:</h2><span></span>
            <span>FirstName: </span><span>${selectedObject.first_name}</span>
            <span>LastName: </span><span>${selectedObject.last_name}</span>
            <span>Address: </span><span>${selectedObject.address}</span>
            <span>Province/State: </span><span>${
              selectedObject.state_prov
            }</span>
            <span>Email: </span><span>${selectedObject.email}</span>
            <span>Phone: </span><span>${selectedObject.phone}</span>

            <h2 class="underline">Bill Detail:</h2><span></span>
            <span>Vehicle Type: </span><span>${$("#vehicleType")
              .val()
              .toUpperCase()}</span>
              `;
    if (document.getElementById("extra").value) {
      HTMLfragment += `
            <span class="underline">Extra</span><span></span>
            `;
    }

    if (document.getElementById("rack").checked) {
      HTMLfragment += `
                <span>Roof/Bicycle Rack</span><span>$5/day</span>
                `;
    }

    if (document.getElementById("gps").checked) {
      HTMLfragment += `
            <span>GPS</span><span>$10</span>
            `;
    }
    HTMLfragment += `
            <span>Total</span><span class="bold">${OutputAsCurrency(
              total
            )}</span>
        </div>
    </div>
        `;

    // document.querySelector('#displayResult').innerHTML = HTMLfragment;
    $("#displayResult").append(HTMLfragment);

    disableForm();
  }

  function OutputAsCurrency(value, currency, locale) {
    // debugger;
    // If the caller didn't specify the currency, use a default of Canadian dollars
    if (!currency) {
      currency = "CAD";
    }
    // If the caller didn't specify the regional locale, use the web browser default locale
    if (!locale) {
      locale = GetPreferredRegion();
    }
    // Bug fix -- if they pass a string value, convert it to a number first
    if (typeof value == "string") {
      value = parseFloat(value);
    }

    var valueAsCurrency = "";
    var conversionRules = {
      style: "currency",
      currency: currency,
    };

    if (value && value.toLocaleString() !== undefined) {
      valueAsCurrency = value.toLocaleString(locale, conversionRules);
    }
    return valueAsCurrency;
  }

  function GetPreferredRegion() {
    var regionalLanguage = "en-US";
    if (navigator.languages && navigator.languages.length) {
      regionalLanguage = navigator.languages[0];
    } else {
      regionalLanguage =
        navigator.userLanguage ||
        navigator.language ||
        navigator.browserLanguage ||
        "en";
    }
    return regionalLanguage;
  }
});
