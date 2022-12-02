$(document).ready(function() {
	/*
	Persistant note app
	Patrick Kelly
	Jan. 2017

	TODO: 
		all done?
	*/

	/*this checks localStorage for previously recorded notes and then re-converts them
		to note objects, and prints them to the DOM.
	*/
	if(localStorage.getItem('noteList')){
		var loadNotes =	JSON.parse(localStorage.getItem('noteList'));
		notes = [];//it should already be empty. 
		for(var i=0;i<loadNotes.length;++i){
			notes.push(new note(loadNotes[i].title, loadNotes[i].body));
		}
		updatePreview(notes);
		//printNotes(notes);//debug tool
	}

	if(localStorage.getItem('body') || localStorage.getItem('title')){
		$("#body").val(localStorage.getItem('body'));
		$("#noteTitle").val(localStorage.getItem('title'));
		$("#noteTitle").css({"color":"black"});
	}

	$("#delBut").hide();//hide till we need it
	$('#printNotes').hide();//debug tool

	$('#noteTitle').focus(function(){
		if($(this).val()==="Title"){
			$(this).val("");
			$('#noteTitle').css({"color":"black"});
		}
	});

	$("#saveNote").click(function(){
		var title = $("#noteTitle").val();
		var body = $("#body").val().replace(/\n/g, '<br/>');
		if(title && body){
			var curNote = new note(title, body);
			notes.push(curNote);
			$("#noteTitle").val("Title");
			$('#noteTitle').css({"color":"grey"});
			$("#body").val("");
		
			$('#inNoteArea').append(curNote.convert(notes.length-1, 1));

			//un comment this when I figure out JSON stringify
			
			localStorage.setItem('noteList', JSON.stringify(notes));
			localStorage.setItem('title', "");
			localStorage.setItem('body', "");

		}else{
			alert("Please fill out the form completely");
		}
	});

	$("#noteTitle").keypress(function(){
		$("#body").keypress();
	})

	$("#body").keypress(function(){
		localStorage.setItem('body', $('#body').val());
		localStorage.setItem('title', $('#noteTitle').val());
	});

	$(document).on('click', '.noteDiv', function(){
		notes[this.id].setActive();
		$('#previewArea').empty();
		$('#previewArea').append(notes[this.id].convert(this.id, 0));
		$("#delBut").show();

	});

	//when a note is deleted, empty the preview area, hide the button, and then 
		//go through the array of notes and delete the 'selected' one.
	$("#delBut").click(function(){
		$('#previewArea').empty();
		$("#delBut").hide();
		for(var i=0; i<notes.length; ++i){
			if(notes[i].selected){
				notes.splice(i, 1);
			}
		}
		updatePreview(notes); //re-do the preview section at the bottom
		localStorage.setItem('noteList', JSON.stringify(notes));
	});

	//debug tool
	$("#printNotes").click(function(){
		alert(localStorage.getItem('noteList'));
		printNotes(notes);
	});

/*	//creates three notes so I don't have to type
	for(var i=0;i<3;++i){
		document.getElementById("noteTitle").value = "Title"+(i+1);
		document.getElementById("body").value = "This is Note "+(i+1);
		$("#saveNote").click();
	}
*/
    
});//end document.ready()



var notes = []; //main note array while page is loaded.

//debug tool to loop through the array and print it to the console.
function printNotes(noteArray){
	//must be passed an array of note objects.
	for(var i=0; i<noteArray.length; ++i){
		noteArray[i].print();
	}
};

//updates the blue preview section at the bottom
function updatePreview(noteArray){
	//must be passed an array of note objects.
	$('#inNoteArea').empty();
	for(var i=0; i<noteArray.length; ++i){
		$('#inNoteArea').append(noteArray[i].convert(i, 1));
	}
}

/*
	Below is the note object.
	insert data about functions and variables here. 
*/
function note(title, body){	
	this.title = title;
	this.body = body;
	this.selected = false;

	this.print = function(){
			console.log("Title: " + this.title + " Body: " + this.body + " Selected: " + this.selected);
	}

	this.convert = function(arrayPos, type){
		var converted = "";
		if(type === 1){
			converted += '<div class="noteDiv" id="'+arrayPos+'"><p class="title">' + this.title + '</p>' + '<p class = "body">' + this.body + '</p></div>';
		}else{
			converted += '<div class="notePrev"><p class="prevTitle">' + this.title + '</p>' + '<p class = "prevBody">' + this.body + '</p></div>';
		}
		return converted;
	}

	this.convertP = function(){
		var converted = "";
		return converted;
	}

	this.setActive = function(){
		for(var i=0;i<notes.length;++i){
			notes[i].selected=false;
		}
		this.selected=true;
	}

	/*this.toString = function(){
		return this.title +";;"+this.body;
	}*/

};//aww.. thats it?