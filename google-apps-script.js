/**
 * =======================================================================
 * GOOGLE APPS SCRIPT FOR AMAN & SUJATA WEDDING RSVP
 * =======================================================================
 * 
 * SETUP INSTRUCTIONS (Sirf 2 Minute Ka Kaam):
 * 
 * 1. Google Drive me jaaiye aur ek new Google Sheet banayein (e.g. "Aman Sujata Wedding RSVP").
 * 2. Upar menu me click karein: Extensions -> Apps Script.
 * 3. Jo default code dikhe use delete karke yeh pura code paste kar dein.
 * 4. Upar blue button "Deploy" -> "New deployment" par click karein.
 * 5. Gear icon (Select type) -> "Web app" choose karein.
 * 6. Configuration set karein:
 *    - Description: "RSVP Form Handler"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"   <--- (YEH BOHOT IMPORTANT HAI)
 * 7. "Deploy" par click karein aur permission grant karein (Advanced -> Go to unsafe par click karein).
 * 8. Aapko ek "Web app URL" milega (format: https://script.google.com/macros/s/AKfycb.../exec).
 * 9. Uss URL ko copy karke `app.js` file me line 436:
 *    const GOOGLE_SHEET_RSVP_URL = "AAPKA_COPIED_URL_YAHAN_PASTE_KAREIN";
 * 10. Save and push to git! Bus kaam ho gaya!
 * =======================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other submissions to complete
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON data
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // If sheet is empty, add formatted headers
    if (sheet.getLastRow() === 0) {
      var headerRow = ["Submission Date & Time (IST)", "Guest Name", "Number of Guests", "Attending Status"];
      sheet.appendRow(headerRow);

      var headerRange = sheet.getRange(1, 1, 1, headerRow.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#d4af37"); // Royal Gold background
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Format IST date and time
    var now = new Date();
    var istFormattedTime = Utilities.formatDate(now, "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

    var attendanceText = (data.attendance === "Yes") ? "Joyfully Accepts (Yes)" : "Regretfully Declines (No)";
    var guestCountText = data.guestCount ? (data.guestCount + " " + (Number(data.guestCount) === 1 ? "Guest" : "Guests")) : "1 Guest";

    // Append new row with guest details
    sheet.appendRow([
      istFormattedTime,
      data.guestName || "Guest",
      guestCountText,
      attendanceText
    ]);

    // Format last appended row
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 4).setVerticalAlignment("middle");
    if (data.attendance === "Yes") {
      sheet.getRange(lastRow, 4).setFontColor("#155724").setFontWeight("bold");
    } else {
      sheet.getRange(lastRow, 4).setFontColor("#721c24");
    }

    // Auto-fit column widths
    sheet.autoResizeColumns(1, 4);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Test function (optional) - Google Apps Script editor me direct run karke test kar sakte hain
function testDoPost() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        guestName: "Rohit Sharma",
        guestCount: "2",
        attendance: "Yes"
      })
    }
  };
  var res = doPost(mockEvent);
  Logger.log(res.getContent());
}
