%%lex

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
"<" return "LESS_THAN"
">" return "GREATER_THAN"
\d+ return "NUMBER"
\w+ return "WORD"

<<EOF>>   { return 'EOF'; }

%%


/lex


grammar
    : expr EOF
        { return $1;}
    ;

expr
    : expr AND expr
        {}
    | expr OR expr
        {}
    | USERNAME LPAREN variables RPAREN
        {}
    | FOLLOW LPAREN pattern_expr RPAREN
        {}
    | CREATION_DATE LPAREN pattern_expr RPAREN
        {}
    | SPECIAL_RANK LPAREN variables RPAREN
        {}
    | CHATTING LPAREN chat_patterns RPAREN
        {}
    | CHATTING_LENGTH LPAREN pattern_expr RPAREN
        {}
    ;


chat_patterns
    : variables
        {}
    | EMOTE_ONLY COMMA variables
        {}
    | JAMO_ONLY COMMA variables
        {}
    ;


variables
    : WORD
        {}
    | WORD COMMA variables
        {}
    ;


pattern_expr
    :  LESS_THAN NUMBER WORD
        {}
    | GREATER_THAN NUMBER WORD
        {}
    ;