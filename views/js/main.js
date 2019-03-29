/*
Bootstable
 @description  Javascript library to make HMTL tables editable, using Bootstrap
 @version 1.1
 @autor Tito Hinostroza
*/
"use strict";
//Global variables
var params = null;  		//Parameters
var colsEdi = null;
var newColHtml = '<div class="btn-group pull-right">' +
    '<button id="bEdit" type="button" class="btn btn-sm btn-primary" onclick="rowEdit(this);">' +
    '<i class="fa fa-pencil"> </i>' +
    '</button>' +
    '<button id="bElim" type="button" class="btn btn-sm btn-default"  onclick="rowElim(this);">' +
    '<i class="fa fa-trash"> </i>' +
    '</button>' +
    '<button id="bAcep" type="button" class="btn btn-sm btn-primary"  onclick="rowAcep(this); "style="display: none;"">' +
    '<i class="fa fa-check"> </i>' +
    '</button>' +
    '<button id="bCanc" type="button" class="btn btn-sm btn-default"  onclick="rowCancel(this);"style="display: none;"">' +
    '<i class="fa fa-times"> </i>' +
    '</button>' +
    '</div>';
var colEdicHtml = '<td name="buttons" style="vertical-align:middle">' + newColHtml + '</td>';
$.fn.SetEditable = function (options) {
    var defaults = {
        columnsEd: null,         //Index to editable columns. If null all td editables. Ex.: "1,2,3,4,5"
        $addButton: null,        //Jquery object of "Add" button
        onEdit: function () { },   //Called after edition
        onBeforeDelete: function () { }, //Called before deletion
        onDelete: function () { }, //Called after deletion
        onAdd: function () { }     //Called when added a new row
    };
    params = $.extend(defaults, options);
    var $rows = this.find('thead tr');
    var $row;
    var rowCount = $rows.length + 0;
    var newTh = $('<th></th>').text("Действия").attr("name", "buttons");
    if (rowCount > 1) {
        $row = $rows.first();
        newTh.attr("rowspan", rowCount);
        console.debug(newTh);
    } else $row = $rows;
    $row.append(newTh);  //encabezado vacío
    this.find('tbody tr').append(colEdicHtml);
    var $tabedi = this;   //Read reference to the current table, to resolve "this" here.
    //Process "addButton" parameter
    if (params.$addButton != null) {
        //Se proporcionó parámetro
        params.$addButton.click(function () {
            rowAddNew($tabedi.attr("id"));
        });
    }
    //Process "columnsEd" parameter
    if (params.columnsEd != null) {
        //Extract felds
        colsEdi = params.columnsEd.split(',');
    }
};
function IterarCamposEdit($cols, tarea) {
    //Itera por los campos editables de una fila
    var n = 0;
    $cols.each(function () {
        n++;
        if ($(this).attr('name') == 'buttons') return;  //excluye columna de botones
        if (!EsEditable(n - 1)) return;   //noe s campo editable
        tarea($(this));
    });
    function EsEditable(idx) {
        //Indica si la columna pasada está configurada para ser editable
        if (colsEdi == null) {  //no se definió
            return true;  //todas son editable
        } else {  //hay filtro de campos
            //alert('verificando: ' + idx);
            for (var i = 0; i < colsEdi.length; i++) {
                if (idx == colsEdi[i]) return true;
            }
            return false;  //no se encontró
        }
    }
}
function FijModoNormal(but) {
    $(but).parent().find('#bAcep').hide();
    $(but).parent().find('#bCanc').hide();
    $(but).parent().find('#bEdit').show();
    $(but).parent().find('#bElim').show();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', '');  //quita marca
}
function FijModoEdit(but) {
    $(but).parent().find('#bAcep').show();
    $(but).parent().find('#bCanc').show();
    $(but).parent().find('#bEdit').hide();
    $(but).parent().find('#bElim').hide();
    var $row = $(but).parents('tr');  //accede a la fila
    $row.attr('id', 'editing');  //indica que está en edición
}
function ModoEdicion($row) {
    if ($row.attr('id') == 'editing') {
        return true;
    } else {
        return false;
    }
}
function rowAcep(but) {
    //Acepta los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var cont = $td.find('input').val(); //lee contenido del input
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
    params.onEdit($row);
}
function rowCancel(but) {
    //Rechaza los cambios de la edición
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (!ModoEdicion($row)) return;  //Ya está en edición
    //Está en edición. Hay que finalizar la edición
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var cont = $td.find('div').html(); //lee contenido del div
        $td.html(cont);  //fija contenido y elimina controles
    });
    FijModoNormal(but);
}
function rowEdit(but) {  //Inicia la edición de una fila
    var $row = $(but).parents('tr');  //accede a la fila
    var $cols = $row.find('td');  //lee campos
    if (ModoEdicion($row)) return;  //Ya está en edición
    //Pone en modo de edición
    IterarCamposEdit($cols, function ($td) {  //itera por la columnas
        var cont = $td.html(); //lee contenido
        var div = '<div style="display: none;">' + cont + '</div>';  //guarda contenido
        var input = '<input class="form-control input-sm"  value="' + cont + '">';
        $td.html(div + input);  //fija contenido
    });
    FijModoEdit(but);
}
function rowElim(but) {  //Elimina la fila actual
    var $row = $(but).parents('tr');  //accede a la fila
    params.onBeforeDelete($row);
    $row.remove();
    params.onDelete();
}
function rowAddNew(tabId) {  //Agrega fila a la tabla indicada.
    var $tab_en_edic = $("#" + tabId);  //Table to edit
    var $filas = $tab_en_edic.find('tbody template');
    var template = true;
    if ($filas.length == 0) {
        $filas = $tab_en_edic.find('tbody tr');
        template = false;
    }
    if ($filas.length == 0) {
        //No hay filas de datos. Hay que crearlas completas
        var $row = $tab_en_edic.find('thead tr');  //encabezado
        if ($row.length > 1)
            $row = $row.last();
        var $cols = $row.find('th');  //lee campos
        if (!$cols.is('[name="buttons"]'))
            $cols = $cols.add($('<th name="buttons"></th>'));
        //construye html
        var htmlDat = '';
        $cols.each(function () {
            if ($(this).attr('name') == 'buttons') {
                //Es columna de botones
                htmlDat = htmlDat + colEdicHtml;  //agrega botones
            } else {
                htmlDat = htmlDat + '<td></td>';
            }
        });
        $tab_en_edic.find('tbody').append('<tr>' + htmlDat + '</tr>');
    } else {
        //Hay otras filas, podemos clonar la última fila, para copiar los botones
        var $ultFila = null;
        if (template) {
            $ultFila = $tab_en_edic.find('template');
            var parent = $ultFila.parent();
            $ultFila = $("<tr></tr>").html($ultFila.html());
            if ($ultFila.find('td#buttons').length == 0) {
                $ultFila.append($("<td>").append(newColHtml));
            }
            parent.append($ultFila);
        } else {
            $ultFila = $tab_en_edic.find('tr:last');
            $ultFila.clone().appendTo($ultFila.parent());
            $ultFila = $tab_en_edic.find('tr:last');
            var $cols = $ultFila.find('td');  //lee campos
            $cols.each(function () {
                if ($(this).attr('name') == 'buttons') {
                    //Es columna de botones
                } else {
                    $(this).html('');  //limpia contenido
                }
            });
        }
    }
    params.onAdd();
}
function TableToCSV(tabId, separator) {  //Convierte tabla a CSV
    var datFil = '';
    var tmp = '';
    var $tab_en_edic = $("#" + tabId);  //Table source
    $tab_en_edic.find('tbody tr').each(function () {
        //Termina la edición si es que existe
        if (ModoEdicion($(this))) {
            $(this).find('#bAcep').click();  //acepta edición
        }
        var $cols = $(this).find('td');  //lee campos
        datFil = '';
        $cols.each(function () {
            if ($(this).attr('name') == 'buttons') {
                //Es columna de botones
            } else {
                datFil = datFil + $(this).html() + separator;
            }
        });
        if (datFil != '') {
            datFil = datFil.substr(0, datFil.length - separator.length);
        }
        tmp = tmp + datFil + '\n';
    });
    return tmp;
}


$('.carousel').carousel({
    interval: 2000
  })


  function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }

 
$(document).ready(function(){
  $("#liDropdown").hover( ()=>{
    if($("#liDropdown").hasClass("show")){
      $("#liDropdown").removeClass("show")
      $("#divDropdown-menu").removeClass("show")
      document.getElementById("navbarDropdown1").setAttribute("aria-expanded", "false")

    }else{
      if($("#liDropdown").hasClass("active")){
        document.getElementById("liDropdown").setAttribute("class","nav-item dropdown show active")
      }
      else{
        document.getElementById("liDropdown").setAttribute("class","nav-item dropdown show")
      }
      document.getElementById("navbarDropdown1").setAttribute("aria-expanded", "true")
      document.getElementById("divDropdown-menu").setAttribute("class","dropdown-menu show")
    } 

  } 
)
})


function subForm(){
    $.ajax({
        type: "POST",
        url: '/a',
       
        data: JSON.stringify(
            {
                login: document.getElementById("inputEmail").value,
                pass: document.getElementById("inputPassword").value
            }
        ),//
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            // localStorage.setItem('Authorization', response.token)
            
            //  Headers.append('Authorization', response.token)
             document.location.href = "/adminNews"
        },
        error: function (response) {

        }
    });
    
    
    
}

function exitAdm(){

    $.ajax({
        type: "POST",
        url: '/exit',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            // localStorage.setItem('Authorization', response.token)
            
            //  Headers.append('Authorization', response.token)
            document.location.href ='/'
        },
        error: function (response) {

        }
    })
   
}

function sendSubNews(){
   
    document.getElementById("subHidden").click();
}


$('#formId').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this)
    
    $.ajax({
        type: 'POST',
        url: '/adminNews',
        data:formData,
        processData:false,
        contentType:false,
        success: function(r){
            alert('Успешно добавлено!')
            document.location.href ='/adminNews'
        },
        error: function(er){
            console.log(er);
            alert('Упс, что то пошло не так')
        }
    })
})

function sendSubCourses(){
   
    document.getElementById("subHidden").click();
}

$('#coursesFormId').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this)
    
    $.ajax({
        type: 'POST',
        url: '/adminCourses',
        data:formData,
        processData:false,
        contentType:false,
        success: function(r){
            alert('Успешно добавлено!')
            document.location.href ='/adminCourses'
        },
        error: function(er){
            console.log(er);
            alert('Упс, что то пошло не так')
        }
    })
})


function sendSubTeacher(){
   
    document.getElementById("subHidden").click();
}

$('#teacherFormId').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this)
    
    $.ajax({
        type: 'POST',
        url: '/adminTeacher',
        data:formData,
        processData:false,
        contentType:false,
        success: function(r){
            alert('Успешно добавлено!')
            document.location.href ='/adminTeacher'
        },
        error: function(er){
            console.log(er);
            alert('Упс, что то пошло не так')
        }
    })
})


function sendSubContact(){
   
    document.getElementById("subHidden").click();
}

$('#contactFormId').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this)
    
    $.ajax({
        type: 'POST',
        url: '/adminContact',
        data:formData,
        processData:false,
        contentType:false,
        success: function(r){
            alert('Успешно добавлено!')
            document.location.href ='/adminContact'
        },
        error: function(er){
            console.log(er);
            alert('Упс, что то пошло не так')
        }
    })
})
  
//function activElem(elemRef){
  //$(".active").removeClass('active')
  //document.getElementById(elemRef).setAttribute("class", "active")

//}


$('#tableAdminNews').SetEditable({
    columnsEd: "0,1,2" //editable columns
   
  })
  