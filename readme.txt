
Install VSCode, a great, lightweight code editor specifically made for Typescript, Javascript, and HTML5/CSS
   https://code.visualstudio.com/

--------------------------------------------------------------------------

Instructions to get running:

   1. Install NodeJS.
   2. Open command window in the new folder
   3. Run "npm install" to get required libraries from npm
   4. Run "gulp build" to do an initial debug build
   5. Run "gulp serve" to start a webserver hosting the debug build

Note: Commands are indicated in " " for example: "npm install"

--------------------------------------------------------------------------

Install NodeJS

   Make sure NPM is included in system PATH
   https://nodejs.org/en/download/

   nightly 			- current works for everyone to see everyday
   rc (release candidate)	- getting feedback versions almost ready to release
   release 			- release version to give to public -- with version number
   tests 			- unit tests (or idea testing)

---------------------------------------------------------------------------

Open command window in the new folder
   Navigate to new folder using comand window/terminal. This will be your workspace.
   
   If using VSCode, you can also open a command window at the root of the folder VSCode is opened at using SHIFT-CTRL-C.

--------------------------------------------------------------------------

Run "npm install" to get required libraries from npm

Note: Before typing in npm install in the command line under workspace it is 
      good practice to make sure that a simple npm command works. This ensures
      that the installer set up your path variables correctly.

   You will need to have Python 2.7 installed to compile some tarball packages. This is not a big deal right now, but
   you may get some warning messages if Python is not installed. Should not affect anything.

   "npm install"
   This will install all modules mentioned in ./package.json, in the local ./node_modules folder.

   "npm install <package> --save" (optional)
   This will install the specified package and save it in ./package.json.'
   For installing individual packages only.
     
Note: After installation you can check the folder node_modules within your workspace
      in order to make sure that the files are installed.

--------------------------------------------------------------------------

Using Gulp

Run "gulp build" to do an initial debug build

   "npm install gulp --global"
   This will install Gulp globally, so that it can be started from anywhere. It will still expect there to be a local version 
   of Gulp installed in node_modules/ of whatever gulpfile you are trying to run.


Run "gulp serve" to start a webserver hosting the debug build

--------------------------------------------------------------------------

Gulp Switches

   --debug (force run in debug mode. debug mode=true by default)
   --release (specify running in release mode, sets debug mode=false)
   --output=<path> (override default output paths of Debug/ & Release/, works with both --release and --debug)
   --serverPath=<path> (specifies the webserver started by serve or serve-watch hosts from a different folder)
   --port=number (manually specify the port number the webserver should host from)

Examples:
   "gulp build --release --output=./Release2"
   "gulp build --release --output=C:\Release"
   "gulp serve --serverPath=C:\Release --port=5000"

--------------------------------------------------------------------------

How to create/clone a tutorial repo:

1. create your folder with all the relevant tutorial source code in it (or if you're like me, copy it from somewhere else). For simplicity I put it in a folder on the C: drive, like
   `C:\CoopExerciseFall2018`
2. navigate to the folder with your tutorial files in it in a terminal and type `hg init` or right click -> tortoise Hg -> Create Repository Here...
3. next, in Windows explorer/file explorer, right click -> Properties -> Sharing -> Share... and give "Everyone" read/write permissions.
   (I'm sure you could give permissions to only specific people, but I've been yolo-ing it so far and nothing bad has happened)
   Also note the "network path" here.
4. in Hg Workbench, go to File -> Settings -> <repo name here>'s Repository Settings (it's very important you don't change your own personal settings here)
5. click "Edit file" and add this:

default = \\SD013102\CoopExerciseFall2018

replace "\\SD013102\CoopExerciseFall2018" with whatever the "network path" was above.

6. if you are happy with all the files the way they are, you can do an hg commit for your initial commit
7. to test if it worked: you can "clone" the repo you just created from File -> Clone Repository and set the "source" as the network path from before (e.g. \\SD013102\CoopExerciseFall2018).
   If you can, try getting someone else on the network to try cloning as well so you can double-check that the permissions were set properly.