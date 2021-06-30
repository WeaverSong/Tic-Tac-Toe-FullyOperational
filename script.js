/*
Module reference:

Name: The name of the module
Description: A simple description
Setup(): Creates the Display object for Module, also creates any additional stuff that you need. This is run when your module stats
    Display[][]: A matrix of elements to be displayed.
        Element{}: An object.
            Char: What do display as
            Available: Whether to allow clicks on it
            Render(html): OPTIONAL. If present it will be called to render the element, and the default rendering will not be used.
Player: String with who's turn it is. Only used for display.
OnClick(x, y): Called when a valid tile is clicked, with the position of the tile.

//Auto included:
Won: Boolean, whether or not the game is over.
_board: A list of objects containing the html data for the cells
    x: x position of this cell
    y: Y position of this cell
    html: the element of this cell
_getCellByPos(): Function that returns the html of the cell with the matching x and y.
_clickHandle(): Function called after every click to re-render the board.
*/



const Main = document.getElementsByTagName("main")[0];
const TitleText = document.getElementById("TitleText");
let Board;
let Modules = [
    //The basic tic tac toe game
    {
        Name: "Tic Tac Toe",
        Description: "Tic Tac Toe, the game.",
        Setup: function ()
        {
            Module.Display = [
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }],
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }],
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }]
            ];
            Module.Rows = [
                Module.Display[0],
                Module.Display[1],
                Module.Display[2],
                [Module.Display[0][0], Module.Display[1][0], Module.Display[2][0]],
                [Module.Display[0][1], Module.Display[1][1], Module.Display[2][1]],
                [Module.Display[0][2], Module.Display[1][2], Module.Display[2][2]],
                [Module.Display[0][0], Module.Display[1][1], Module.Display[2][2]],
                [Module.Display[0][2], Module.Display[1][1], Module.Display[2][0]]
            ];
            Module.CheckFullRow = function (row)
            {
                let X = row.filter(a => a.Char == "X");
                let O = row.filter(a => a.Char == "O");
                let Blank = row.filter(a => a.Char == " ");

                if (X.length == 3) return "X";
                else if (O.length == 3) return "O";
                else if (Blank.length > 0) return " ";
                else return -1;
            }
            Module.CheckGameOver = function ()
            {
                let isTie = true;
                for (var i = 0; i < Module.Rows.length; i++)
                {
                    let Result = Module.CheckFullRow(Module.Rows[i]);
                    if (Result == "X") Module.Won = "X won the game!";
                    else if (Result == "O") Module.Won = "O won the game!";
                    else if (Result == " ") isTie = false;
                }
                if (isTie && !Module.Won) Module.Won = "It's a tie!"
            }
        },
        Player: "X",
        OnClick: function (x, y)
        {
            Module.Display[y][x].Char = Module.Player;
            Module.Display[y][x].Available = false;
            if (Module.Player == "X") Module.Player = "O";
            else Module.Player = "X";

            Module.CheckGameOver();
        }
    },
    //A different tic tac toe version - Misere Tic-tac-toe
    {
        Name: "Misere Tic Tac Toe",
        Description: "Try to avoid getting 4 in a row!",
        Setup: function ()
        {
            Module.Display = [
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }],
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }],
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }],
                [{ Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }, { Char: " ", Available: true }]
            ];
            Module.Rows = [
                Module.Display[0],
                Module.Display[1],
                Module.Display[2],
                [Module.Display[0][0], Module.Display[1][0], Module.Display[2][0], Module.Display[3][0]],
                [Module.Display[0][1], Module.Display[1][1], Module.Display[2][1], Module.Display[3][1]],
                [Module.Display[0][2], Module.Display[1][2], Module.Display[2][2], Module.Display[3][2]],
                [Module.Display[0][3], Module.Display[1][3], Module.Display[2][3], Module.Display[3][3]],
                [Module.Display[0][0], Module.Display[1][1], Module.Display[2][2], Module.Display[3][3]],
                [Module.Display[3][0], Module.Display[2][1], Module.Display[1][2], Module.Display[0][3]]
            ];
            Module.CheckFullRow = function (row)
            {
                let X = row.filter(a => a.Char == "X");
                let O = row.filter(a => a.Char == "O");
                let Blank = row.filter(a => a.Char == " ");

                if (X.length == 4) return "X";
                else if (O.length == 4) return "O";
                else if (Blank.length > 0) return " ";
                else return -1;
            }
            Module.CheckGameOver = function ()
            {
                let isTie = true;
                for (var i = 0; i < Module.Rows.length; i++)
                {
                    let Result = Module.CheckFullRow(Module.Rows[i]);
                    if (Result == "X") Module.Won = "O won the game!";
                    else if (Result == "O") Module.Won = "X won the game!";
                    else if (Result == " ") isTie = false;
                }
                if (isTie && !Module.Won) Module.Won = "It's a tie!"
            }
        },
        Player: "X",
        OnClick: function (x, y)
        {
            Module.Display[y][x].Char = Module.Player;
            Module.Display[y][x].Available = false;
            if (Module.Player == "X") Module.Player = "O";
            else Module.Player = "X";

            Module.CheckGameOver();
        }
    },
    //Freeform turn-based game engine, anyone?
    {
        Name: "Wander",
        Description: "Just wander around. Click an adjacent square to go there.",
        Setup: function ()
        {
            //Defines the initial board, with walls at the edges and randomly scattered
            this.Board = [];
            for (var y = 0; y < 11; y++)
            {
                Module.Board.push([]);
                for (var x = 0; x < 11; x++)
                {
                    if (x <= 1 || y <= 1 || x >= 9 || y >= 9)
                    {
                        this.Board[y].push({ Char: "W", Available: false });
                    }
                    else if (Math.random() > 0.6)
                    {
                        this.Board[y].push({ Char: "W", Available: false });
                    }
                    else
                    {
                        this.Board[y].push({ Char: " ", Available: false });
                    }
                }
            }

            //Sets the display window based on the coords of the new center position
            this.setDisplay = function (xPos, yPos)
            {
                this.Display = [];
                this.Pos = {x: xPos, y: yPos};
                for (var y = 0; y < 5; y++)
                {
                    this.Display.push([]);
                    for (var x = 0; x < 5; x++)
                    {
                        this.Display[y].push(this.Board[y + yPos - 2][x + xPos - 2]);
                        if (x != 0 && x != 4 && y != 0 && y != 4 && !(x == 2 && y == 2) && this.Display[y][x].Char != "W")
                        {
                            this.Display[y][x].Available = true;
                        }
                        else
                        {
                            this.Display[y][x].Available = false;
                        }

                        if (this.Display[y][x].Char == "O")
                        {
                            this.Display[y][x].Char = " ";
                        }

                        if (x == 2 && y == 2)
                        {
                            this.Display[y][x].Char = "O";
                        }
                    }
                }
            }

            //Default position
            this.setDisplay(2, 2);
        },
        Player: "O",
        OnClick: function (x, y)
        {
            this.setDisplay(this.Pos.x + x - 2, this.Pos.y + y - 2);
        }
    }
];
//The object holding the current module's data
let Module = {};

//Prepares the list of modules to play
const DisplayModuleList = function()
{
    //Set the text
    TitleText.innerText = "Available Modules:"

    //Clear the old stuff
    Main.innerHTML = "";

    Modules.forEach(m => {
        //Make the button
        let NewGameButton = document.createElement("button");
        NewGameButton.className = "GameButton";
        NewGameButton.textContent = m.Name;
        NewGameButton.onclick = () => {
            StartModule(-1, m.Name)
        };
        NewGameButton.title = m.Description;
        Main.appendChild(NewGameButton);
    });
};
//clears everything and loads a module by index or name.
const StartModule = function (index, name)
{
    //Clear out any old buttons
    Main.innerHTML = "";

    //Blank out the module object, so it is ready to for the new data
    Module = {};

    //If we didn't get our index, try to find it by name.
    if (index == undefined || index == -1) index = Modules.findIndex((i) => i.Name == name);
    //If that also failed, throw an error.
    if (index == -1) throw "Could not find the module!";

    //Make a ref of the object for easy access;
    let temp = Modules[index];

    //Clone the basic data
    Module.Name = temp.Name;
    Module.Description = temp.Description;
    Module.Setup = temp.Setup;
    Module.Player = temp.Player;
    Module.OnClick = temp.OnClick;

    //Add the default data. Thse can be overriden by Setup if needed
    Module.Won = false;
    Module._board = [];
    Module._getCellByPos = function (x, y)
    {
        return (Module._board.find(i => i.x == x && i.y == y).html);
    }
    Module._clickHandle = function ()
    {

        //Turn display:
        TitleText.innerText = Module.Name + " - " + Module.Player + "'s turn";

        //Victory check
        if (Module.Won != false)
        {
            //Display victory (or any ending message, really)
            TitleText.innerText = Module.Won;
        }

        //Render pass
        for (var y = 0; y < Module.Display.length; y++)
        {
            for (var x = 0; x < Module.Display[y].length; x++)
            {
                let cell = Module.Display[y][x];
                let html = Module._getCellByPos(x, y);
                
                if (cell.Render)
                {
                    cell.Render(html);
                }
                else
                {
                    html.innerText = cell.Char;
                    if (cell.Available && Module.Won == false)
                    {
                        if (html.classList.contains("unavailable"))
                        {
                            html.classList.remove("unavailable");
                        }
                    } else
                    {
                        if (!html.classList.contains("unavailable"))
                        {
                            html.classList.add("unavailable");
                        }
                    }
                }

            }
        }
    };

    //Call the setup function to prep the rest of the data. Display board is run from this function, to so the copying won't be a ref.
    Module.Setup();

    //Set the title
    TitleText.innerText = Module.Name;

    //Create a board, with the classname of "board"
    Board = document.createElement("div");
    Board.className = "board";

    //Assemble the board
    for (var y = 0; y < Module.Display.length; y++)
    {

        //Create the width for this row based on how large the board is. Always assumed to be a rectangle.
        let width = document.createAttribute("style");
        width.value = "width: " + (Module.Display[0].length * 106) + "px;"

        //Create the new row
        let row = document.createElement("div");
        row.className = y + " row";
        row.attributes.setNamedItem(width);

        //Loop to create the cells in the row
        for (var x = 0; x < Module.Display[0].length; x++)
        {
            //CSS class to make it display correctly
            let css = "";
            if (x != 0)
            {
                css += " left"
            }
            if (x != Module.Display[0].length - 1)
            {
                css += " right";
            }

            if (y != 0)
            {
                css += " top"
            }
            if (y != Module.Display.length - 1)
            {
                css += " bottom";
            }

            //Create the cell, and give it the correct classes
            let cell = document.createElement("div");
            cell.className = y + " " + x + css;

            //Clone the variables so we lose the connection to the vars used in the loop
            //If we don't do that, all the cell's handlers will think they are at the bottom right
            let a = x;
            let b = y;

            //Assign the onclick function of the current cell to call the Module's onclick with the x and y coords of the cell
            cell.onclick = () =>
            {
                if (Module.Display[b][a].Available && Module.Won == false)
                {
                    Module.OnClick(a, b);
                    Module._clickHandle();
                }
            };

            //Add the cell, and relevant data, to the list
            Module._board.push({
                html: cell,
                x: a,
                y: b
            });


            //Add the cell to the row
            row.appendChild(cell);
        };

        //Add the row to the board
        Board.appendChild(row);
    };

    //Add the board to the html
    Main.appendChild(Board);

    //First rendering pass
    Module._clickHandle();

    //Make module list button
    let NewGameButton = document.createElement("button");
    NewGameButton.className = "GameButton";
    NewGameButton.textContent = "New Game";
    NewGameButton.onclick = DisplayModuleList;

    let padding = document.createElement("div");
    padding.className = "padding";
    padding.appendChild(NewGameButton);

    Main.appendChild(padding);
};


DisplayModuleList();