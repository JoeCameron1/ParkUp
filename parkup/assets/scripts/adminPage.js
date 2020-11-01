/**
 * adminPage.js
 * Admin Page JavaScript
 */

var rowValuesBeforeEditing = {};

// Hide the row for adding users on start
$(document).ready(function() {
    $('.table tr').eq(1).hide();
});

// Show the row for adding users
$("#addUser").click(function(){
    $('.table tr').eq(1).show();
});

// Read the input and create a new row at the bottom of the table
$('.addNewUser').click(function() {
    var $row = $(this).closest('tr');
    var $columns = $row.find('td');

    // Start creating the new row
    var values = '<tr>';
    // Flag to check that the input is not empty
    var emptyInput = false;
    $columns.each(function(i, item) {
        if (i < 5) {
            if (!item.children[0].value.trim()) {
                emptyInput = true;
                return;
            }
            values = values + '<td>' + item.children[0].value + '</td>';
        }
    });

    // If there is an empty input, don't try to save this new user entry
    if (emptyInput) {
        return;
    }

    // Else, continue and add the new buttons the the new row
    values = values +
        '<td>' +
        '   <button class="btn btn-warning editUser">' +
        '       <span class="glyphicon glyphicon-pencil"></span>' +
        '   </button>' +
        '</td>' +
        '<td>' +
        '   <button class="btn btn-danger removeUser">' +
        '       <span class="glyphicon glyphicon-remove"></span>' +
        '   </button>' +
        '</td>' +
        '</tr>';

    // Reset the inputs for the new user row and hide the new user row
    $row.find('input').each(function() {
        $(this).val('');
    });
    $('.table tr').eq(1).hide();

    // Add the new row
    $('.table tr:last').after(values);
});

// Cancel the new user you were about to add
$('.dontAddNewUser').click(function() {
    var $row = $(this).closest('tr');
    // Reset the inputs
    $row.find('input').each(function() {
        $(this).val('');
    });
    // Hide the new user row
    $('.table tr').eq(1).hide();
});

// Remove a user from the table
$(document).on('click', '.removeUser', function() {
    var $row = $(this).closest('tr');
    $row.remove();
});

// Change a current user
$(document).on('click', '.editUser', function() {
    var $row = $(this).closest('tr');
    var $columns = $row.find('td');

    var button;
    // Array to hold the values before the possible changes
    var array = [];
    // Variable to hold the previous value of the cell
    var oldText;
    $columns.each(function(i) {
        if (i < 2) {
            oldText = $(this).text();
            array.push(oldText);
            $(this).text('');
            $(this).append('<input type="text" value=' + oldText +'>');
        } else if (i == 2) {
            oldText = $(this).text();
            array.push(oldText);
            $(this).text('');
            $(this).append('<input type="text" value=' + oldText +' style="width:80%">');
        } else if (i == 3) {
            oldText = $(this).text();
            array.push(oldText);
            $(this).text('');
            $(this).append('<input type="text" value=' + oldText +' style="width:30%">');
        } else if (i == 4) {
            oldText = $(this).text();
            array.push(oldText);
            $(this).text('');
            $(this).append('<input type="text" value=' + oldText +' style="width:30%">');
        } else if (i == 5) {
            button = $(this).find('button');
            toggleEdit(button);
        } else if (i == 6) {
            button = $(this).find('button');
            button.addClass('cancelEdits');
            button.removeClass('removeUser');
        }
    });
    // Save values before the edit
    rowValuesBeforeEditing[$row.index()] = array;
});

// Save the new changes to the user
$(document).on('click', '.doneEditUser', function() {
    var $row = $(this).closest('tr');
    var $columns = $row.find('td');

    // Check the inputs
    var emptyInput = false;
    $columns.each(function(i) {
        if (i < 5) {
            if (!$(this).find('input').val().trim()) {
                emptyInput = true;
                return;
            }
        }
    });

    // If any of the inputs are empty, don't save
    if (emptyInput) {
        return;
    }

    // Otherwise continue and save all the new changes and change the buttons
    var button;
    $columns.each(function(i) {
        if (i < 5) {
            var inputText = $(this).find('input').val();
            $(this).text(inputText);
        } else if (i == 5) {
            button = $(this).find('button');
            toggleEdit(button);
        } else if (i == 6) {
            button = $(this).find('button');
            button.addClass('removeUser');
            button.removeClass('cancelEdits');
        }
    })
});

// Revert to previous values for the user, not saving any changes in the making
$(document).on('click', '.cancelEdits', function() {
    var $row = $(this).closest('tr');
    var $columns = $row.find('td');

    var button;

    // Grab the values of the row before the editing
    var oldValues = rowValuesBeforeEditing[$row.index()];
    $columns.each(function(i) {
        if (i < 5) {
            $(this).text(oldValues[i]);
        } else if (i == 5) {
            button = $(this).find('button');
            toggleEdit(button);
        } else if (i == 6) {
            button = $(this).find('button');
            button.addClass('removeUser');
            button.removeClass('cancelEdits');
        }
    })
});

// Helper function to change the edit button to the done editing button
function toggleEdit(button) {
    if (button.hasClass('btn-success')) {
        button.addClass('btn-warning');
        button.addClass('editUser');
        button.removeClass('btn-success');
        button.removeClass('doneEditUser');
        button.text('');
        button.append('<span class="glyphicon glyphicon-pencil"></span>');
    } else if (button.hasClass('btn-warning')) {
        button.addClass('btn-success');
        button.addClass('doneEditUser');
        button.removeClass('btn-warning');
        button.removeClass('editUser');
        button.text('');
        button.append('<span class="glyphicon glyphicon-ok"></span>');
    }

    button.css('min-width', '0');
    button.css('min-height', '0');
    button.css('width', '20px');
    button.css('height', '20px');
    button.css('padding', '0');
}