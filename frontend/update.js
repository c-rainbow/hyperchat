


eel.expose(my_javascript_function);
function my_javascript_function(a, b) {
    console.log(a + b);
}


function toggleBookmark(chat_id, button_elem) {
    let button = $(button_elem);
    if (button.hasClass("bookmarked")) {
        eel.UnbookmarkChat(chat_id);
        button.text('☆');
        button.removeClass("bookmarked");
        button.addClass("unbookmarked");
    }
    else if (button.hasClass("unbookmarked")) {
        eel.BookmarkChat(chat_id);
        button.text('★');
        button.removeClass("unbookmarked");
        button.addClass("bookmarked");
    }
}


eel.expose(handle_new_chat);
function handle_new_chat(username, display_name, original_chat, translated_chat, chat_id) {

    $(".main-container .left-chat-container").append(
        `<div class="row chat-line"><span><button class="unbookmarked" onclick="toggleBookmark('${chat_id}', this)">☆</button></span>${display_name}(${username}) ${original_chat}</div>`
    );



    $(".main-container .right-chat-container").append(
        `<div class="row chat-line">${display_name}(${username}) ${translated_chat}</div>`
    );
}
