function createTask(projectid)
{
	var name = $('#name')
	var notes = $('#notes')

	var data = {
		name : name.val(),
	 	notes: notes.val(), 
	 	projectid: projectid
	};

	name.val("");
	notes.val("");

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var response = ajax.responseText;
			console.log(response)
			addTaskCard(JSON.parse(response));
		}
	};
	console.log(data)
	ajax.open("POST", '/createTask');
	ajax.setRequestHeader("Content-type", "application/json");
	ajax.send(JSON.stringify(data));
}

$('.task-card').on( "click", function() {
	console.log("hello")
   	this.val(function() 
   	{
   		$(`${"#" + $(this).attr("data-target")}`).modal('show');
	});
});

function updateTask(taskid)
{
	var name = $(`${"#task" + taskid}`).find('#name')
	var notes = $(`${"#task" + taskid}`).find('#notes')

	var data = {
		name : name.val(),
	 	notes: notes.val(), 
	 	id: taskid
	};
	console.log($(`.task-card[data-target="${"#task" + taskid}"]`).find(".task-header").text())
	$(`.task-card[data-target="${"#task" + taskid}"]`).find(".task-header").text(name.val());
	$(`.task-card[data-target="${"#task" + taskid}"]`).find(".task-notes").text( notes.val());

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var response = ajax.responseText;
			console.log(response)
		}
	};
	console.log(data)
	ajax.open("POST", '/updateTask');
	ajax.setRequestHeader("Content-type", "application/json");
	ajax.send(JSON.stringify(data));
}

function addComment(taskid)
{
	var comment = $(`${"#task" + taskid}`).find('#comment')

	var data = {
	 	comment: comment.val(), 
	 	id: taskid
	};

	comment.val("");

	$(`#task${taskid}`).find('.modal-content').css({ 'opacity' : 0.8 });
	$(`#task${taskid}`).find('.loader').show()

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4 && ajax.status == 200) {
			var response = ajax.responseText;
			console.log(response)
			addCommetHTML(JSON.parse(response))
		}
	};
	ajax.open("POST", '/addComment');
	ajax.setRequestHeader("Content-type", "application/json");
	ajax.send(JSON.stringify(data));
}


function addCommetHTML(task)
{
	if($(`#task${task.id}`).find(".comments").length > 0)
	{
		$(`#task${task.id}`).find(".comments").append(`<p>${task.text}</p><p class="text-right">- ${task.created_at}</p>`)
	}
	else
		$(`#task${task.id}`).find(".task-details").append(`<h5>Comments:</h5><div class="comments"><p>${task.text}</p><p class="text-right">- ${task.created_at}</p></div>`)
	$(`#task${task.id}`).find('.loader').hide()
	$(`#task${task.id}`).find('.modal-content').css({ 'opacity' : 1 });
}

function addTaskCard(task)
{

	var html = "";
	html += `<div class="col-sm-4">
				<div class="col-sm-12 bg-light task-card p-3 mb-5 rounded" data-toggle="modal" data-target="#task${task.id}">
					<div class="row">
						<div class="col-sm-12">
							<h5 class="text-center task-header">${task.name}</h5>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<p class="task-card-date text-right">${task.created_at}</p>
						</div>
					</div>
					<div class="row">
						<div class="col-sm-12">
							<p class="task-notes">${task.notes}</p>
						</div>
					</div>
				</div>
				<div class="col-12">
					<div class="modal fade" id="task${task.id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" style="display: none;" aria-hidden="true">
						<div class="modal-dialog" role="document">
							<div class="loader"></div><div class="modal-content">
								<div class="modal-header">
									<h5 class="modal-title" id="exampleModalLabel">${task.name}</h5>
									<button class="close" type="button" data-dismiss="modal" aria-label="Close">
										<span aria-hidden="true">×</span>
									</button>
								</div>
								<div class="modal-body">
									<div class="task-details">
										<p>${task.notes}</p>
									</div>
									<form>
										<div class="form-group">
											<label class="col-form-label" for="comment">New comment:</label>
											<textarea class="form-control" id="comment" name="comment" rows="5"></textarea>
										</div>
									</form>
								</div>
								<div class="modal-footer">
									<button class="btn btn-secondary" type="button" data-dismiss="modal">Close</button>
									<button class="btn btn-primary" type="button" onclick="addComment('${task.id}')">Comment </button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`
	$('.task-container').append(html);
}