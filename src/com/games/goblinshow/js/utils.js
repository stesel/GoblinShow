/**
 * Created by Leo on 14.05.2015.
 */

var console =
{
    log : function(message)
    {
        var logArea = document.getElementById("logArea");
        var text = document.createTextNode("\n" + message);
        logArea.appendChild(text);
        logArea.scrollTop = logArea.scrollHeight;
    }
};