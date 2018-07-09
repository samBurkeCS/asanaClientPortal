var asana = require('asana');
var moment = require('moment');

exports.home = async (req,res) => 
{
	let tasks = await getAllTaskForProject("Asana Web Portal")
	res.render('index', {tasks})
}

async function getTaskComments(client, id)
{
	let comments = [];
	await client.stories.findByTask(id, {opt_fields : "text,type,created_at"})
	.then(function(response) 
	{
		response.data.forEach((value) => 
		{	
			if(value.type == "comment")
			{
				value.created_at = moment(value.created_at).fromNow(); 
				comments.push(value)
			}
		})
	}).catch((err) =>
	{
		console.log(err)
	})

	return comments
};

//This will get all tasks and the task comments for a given project
async function getAllTaskForProject(projectName)
{
	let tasks;
	let project;
	var client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
	await client.users.me()
	.then(function(user) {
		var userId = user.id;
		// The user's "default" workspace is the first one in the list, though
		// any user can have multiple workspaces so you can't always assume this
		// is the one you want to work with.

		var workspaceId = user.workspaces[1].id;
		 return client.projects.findAll({
		 workspace: workspaceId,
		});
	})
	.then((response) => 
	{
		project = response.data.find((value) => 
		{
			return value.name == projectName
		});

		//find all in project and return these fields
		return client.tasks.findAll(
		{
			project: project.id,
			opt_fields: 'id,assignee,assignee_status,created_at,completed,completed_at,due_on,due_at,external,followers,name,notes,parent,workspace,memberships'
		});
	})
	.then((response) => 
	{	
		//Make the date more readable
		response.data.forEach(async (value)=>{
			value.created_at = moment(value.created_at).fromNow(); 
			value.project = project.id
		})
		tasks = response.data
	});

	//does a parellel get of every tasks comments and sets each task comment to be the array returned
	await Promise.all(tasks.map(async (value) => {
		value.comments = await getTaskComments(client, value.id)
  	}));

	return tasks;
}

//creates a task based on data given
exports.createTask = async (req,res) => 
{
	console.log(req.body)
	var client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
	let data = {projects: [req.body.projectid], name: req.body.name, notes: req.body.notes}
	await client.tasks.create(data)
	.then((response)=>
	{
		response.created_at = moment(response.created_at).fromNow(); 
		res.send(response);
	}).catch((error) =>
	{
		console.log(error)
	})
}

exports.updateTask = async (req,res) => 
{
	console.log(req.body)
	var client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
	let data = {name: req.body.name, notes: req.body.notes}
	await client.tasks.update(req.body.id ,data)
	.then((response)=>
	{
		res.send(response);
	}).catch((error) =>
	{
		console.log(error)
	})
}

exports.addComment = async (req,res) => 
{
	console.log(req.body)
	var client = asana.Client.create().useAccessToken(process.env.ASANA_KEY);
	let data = {text: req.body.comment}
	await client.stories.createOnTask(req.body.id ,data)
	.then((response)=>
	{
		response.id = req.body.id;
		response.created_at = moment(response.created_at).fromNow(); 
		res.send(response);
	}).catch((error) =>
	{
		console.log(error)
	})
}