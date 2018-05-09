# OpsVision

OpsVision provides a mechanism to construct and publish content, metrics and dashboards to any device capable of rendering a URL.  
Use this app to publish operational content across your organization.  Agile governance for the modern technology shop.

# How to use OpVision in your Business
1.  Channels are created that include real-time system monitors, build statistics, sprint priorities, and announcements.  These channels are broadcast to TVs across our global offices 
and are accessible on our corporate Intranet.  Each group - Technology, Marketing, Service, etc. can create and self-service its own channels with unique content
2.  Create initiative Dashboards to highlight and manage progress on strategic goal
3.  Track quality and defect metrics with dashboards and charts.  Raw defect and metric measurement data is imported into MySQL server using a near real-time SQL batch job.  In the future, we will incorporate API into OpsVision to replace batch SQL import
4.  Visualize product roadmaps and resource plans
5. Special Admin features like configuring URLs, Channels, and dashboards are available by navigating to localhost:777/admin (cookie set)


### Technology Stack
	AngularJS
	Angular UI-Grid
	Bootstrap
	Charts.js
	Smart-table
	Node.js
	Express
	EJS
	MySQL
	Gulp
	
### Installation
Install MySQL 5.5+
	Create database CommandCenter (Run DDL then DML metadata) using [database scripts](https://github.com/mitchellsjohnson/OpsVision/tree/master/database) in project.
	Configure connection strings in [config folder](https://github.com/mitchellsjohnson/OpsVision/tree/master/config).

Install application via `npm`:
```
npm install
```
This will install `OpsVision` from application's `package.json` file.

### Running the app

	gulp js --minify and combine Angular App for improved performance
    node server.js

navigate to localhost:777

## Directory Layout
    
    app.js              --> Node server app config
    package.json        --> for npm for Node
	mysqllib.js			--> MySQL Driver 
	OpsVision.sln		--> VisualStudio Solution
    public/             --> All of the files to be used in the Angular App;  Main UI of application
		node_components/       --> Angular, Bootstrap, and 3rd party JavaScript libraries
		css/
		images/
		js/						--> Angular App Root
		partials/         		--> Partial Views for Angular App
	server/				--> Node Server  
		routes/					--> RESTful Service Definition
		views/					--> Views for Broadcasting Content
	config/				--> Web Server Port and Database connection string for DEV and PROD
    

## Roadmap
1.  Upgrade UI Grid - move to NPM
2.  Upgrade component libraries (Angular, etc.)
3.  Add user authentication and roles

