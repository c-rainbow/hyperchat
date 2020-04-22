%lex

%%

"아이디" return "USERNAME"
"팔로우" return "FOLLOW"
"생성" return "CREATION_DATE"
"등급" return "SPECIAL_RANK"
"채팅" return "CHATTING"
"채팅길이" return "CHATTING_LENGTH"
"&" return "AND"
"|" return "OR"
"," return "COMMA"

\s+ {/* skip whitespace */}
"emote-only" return "EMOTE_ONLY"
"jamo-only" return "JAMO_ONLY"
"(" return "LPAREN"
")" return "RPAREN"
\d+"일"\s*"이하" return "LTOE"
\d+"일"\s*"이상" return "GTOE"
//\d+ return "NUMBER"
\w+ return "WORD"

<<EOF>>   return 'EOF'


/lex

%left AND
%left OR


%{
    function checkUsername(username){
        console.log("in checkUsername");
        return username;
    }
    function checkFollow(username){
        console.log("in checkFollow");
        return username;
    }
    function checkAccountCreation(username){
        console.log("in checkAccountCreation");
        return username;
    }
    function checkRank(username){
        console.log("in checkRank");
        return username;
    }
    function checkChatContent(username){
        console.log("in checkChatContent");
        return username;
    }
    function checkChatLength(username){
        console.log("in checkChatLength");
        return username;
    }
%}




%%

grammar
    : expr EOF
        { console.log($1); return $1;}
    ;

expr
    : expr AND expr
        { $$ = $1 && $3; }
    | expr OR expr
        { $$ = $1 || $3; }
    | USERNAME LPAREN variables RPAREN
        { $$ = checkUsername($3); }
    | FOLLOW LPAREN pattern_expr RPAREN
        { $$ = checkFollow($3); }
    | CREATION_DATE LPAREN pattern_expr RPAREN
        { $$ = checkAccountCreation($3); }
    | SPECIAL_RANK LPAREN variables RPAREN
        { $$ = checkRank($3); }
    | CHATTING LPAREN chat_patterns RPAREN
        { $$ = checkChatContent($3); }
    | CHATTING_LENGTH LPAREN pattern_expr RPAREN
        { $$ = checkChatLength($3); }
    ;

chat_patterns
    : variables
        { $chat_patterns.push($1); }
    | EMOTE_ONLY COMMA variables
        { $chat_patterns.push("emote-only"); $chat_patterns.push(...$variables); }
    | JAMO_ONLY COMMA variables
        { $chat_patterns.push("jamo-only"); $chat_patterns.push(...$variables); }
    ;

variables
    : WORD
        { $$ = [$1]; }
    | WORD COMMA variables
        { var rt = [$1]; rt.push(...$variables); $$ = rt; }
    ;

pattern_expr
    : LTOE
        { 
            let days = $1.match(/\d+/);    
            
            console.log(days + "일 이하하하"); $$ = $1;
            
            
        }
    ;