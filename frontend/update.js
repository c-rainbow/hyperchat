


eel.expose(my_javascript_function);
function my_javascript_function(a, b) {
    console.log(a + b);
}


eel.expose(handle_new_chat);
function handle_new_chat(username, display_name, original_chat, translated_chat) {

    $(".main-container .left-chat-container").append(
        `<div class="row chat-line">${display_name}(${username}) ${original_chat}</div>`
    );

    $(".main-container .right-chat-container").append(
        `<div class="row chat-line">${display_name}(${username}) ${translated_chat}</div>`
    );
}