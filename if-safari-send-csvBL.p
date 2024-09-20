/*DEFINE INPUT PARAMETER csv-name AS CHARACTER NO-UNDO.*/
/*DEFINE INPUT PARAMETER csv-value AS LONGCHAR NO-UNDO.*/
DEFINE VARIABLE csv-name AS CHARACTER NO-UNDO.
DEFINE VARIABLE csv-value AS LONGCHAR NO-UNDO.
DEFINE VARIABLE encrypted-value AS CHARACTER NO-UNDO.
DEFINE VARIABLE path AS CHARACTER NO-UNDO.
DEFINE VARIABLE cmd AS CHARACTER NO-UNDO.

/*DEBUG - Start*/
csv-name = "test-progress.csv".
csv-value =
    "name,email,phone,               " + '~n' +
    "halo,halo@mail.com,0811111111,  " + '~n' +
    "halo2,halo2@mail.com,0822222222," + '~n' +
    "halo3,halo3@mail.com,0833333333," + '~n' +
    "halo4,halo4@mail.com,0844444444 ".
path = "C:\Users\sinda\OneDrive\Desktop\ALDER\VHP\WORKSPACE\Exercise\project-google-api\app.mjs".
/*DEBUG - End*/

RUN encrypt-base64(INPUT csv-value,
                   OUTPUT encrypted-value).

ASSIGN cmd = 'node "' + path + '" ' + csv-name + ' ' + encrypted-value.

OS-COMMAND SILENT VALUE(cmd) NO-CONSOLE.

/******************************PROCEDURE****************************/
PROCEDURE encrypt-base64:
    DEFINE INPUT PARAMETER input-param      AS CHARACTER NO-UNDO.
    DEFINE OUTPUT PARAMETER output-param    AS CHARACTER NO-UNDO.
    DEFINE VARIABLE memptr-data             AS MEMPTR.
    SET-SIZE(memptr-data) = LENGTH(input-param).
    PUT-STRING(memptr-data,1,LENGTH(input-param)) = input-param.
    output-param = BASE64-ENCODE(memptr-data).
    SET-SIZE(memptr-data) = 0.
END PROCEDURE.
