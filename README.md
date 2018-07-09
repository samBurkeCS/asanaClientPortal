#Asana Client Portal

A simple node project to create a client portal for your Asana projects

Grab your api key from [Asana's developer console](https://app.asana.com/-/developer_console), and choose "create new personal access token".

Set your enviroment variable 'ASANA_KEY' to be this value.

Inside the asanaController under the getAllTaskForProject function make sure you select the correct workspace that task will be pulled from.

`var workspaceId = user.workspaces[1].id;`

Under the 'home' function make sure select the correct name of your project in order to grab all the task for that project. 

```
exports.home = async (req,res) => 
{
	let tasks = await getAllTaskForProject("Asana Web Portal")
	res.render('index', {tasks})
}
```