## cd to project
cd /mnt/c/Users/deena/OneDrive/Desktop/kanbanv2

## start redis server on windows
redis-server
sudo service redis-server start

## start worker in ubuntu

celery -A main.celery worker -l info

## start beat in ubuntu

celery -A app.celery beat --max-interval 1 -l info
celery -A main:celery beat --loglevel=INFO

## mailhog server

ip = ip addr // to get ip of wsl  
ip:8025

## start mailhog server

sudo apt-get -y install golang-go
go get github.com/mailhog/MailHog
~/go/bin/MailHog
Mailhog

## cache key

flask_cache_view//api/user/lists

# to create virtualenv using windows command promt
- to create virtualenv `python3 -m venv .proj-env`
- to activate virtualenv `.proj-env\Scripts\activate.bat`

# to intall required packages-
- open the file `notepad requirements.txt`
- to install all packages `pip install -r requirements.txt`
 
# Local run setup-
- if venv is not active `.proj-env\Scripts\activate.bat`
- run `python main.py`
- press CTRL button and click on `http://127.0.0.1:8080`
- to quit -> Press CTRL+C in the terminal

# Folder Structure

- `application` is where our application code is
- `db_directory` has the sqlite DB. 
- `Report&docs` - contains project report and yaml file.
- `static` - container for images,component folder( js files used for vue components), css files, csv file
- `templates` - Default flask templates folder
- `main.py` - python file to create the app.
- `requirements.txt` - contains all required packages to be installed to run the app.

```
├── __pycache__
├── application
|   ├── __pycache__
│   ├── __init__.py
│   ├── api.py
│   ├── config.py
│   ├── models.py
│   ├── task.py
|   └── workers.py
├── db_directory
│   └── database.sqlite3
├── Report&docs
│   └── Project_Report.pdf
├── static
|   └── components
|       ├── add_card.js
|       ├── add_list.js
|       ├── base.js
|       ├── edit_card.js
|       ├── login.js
|       ├── move_all_cards.js
|       ├── signup.js
|       ├── summary.js
|       └── users.js
|    ├── app.js
|    ├── base.css
|    ├── dasboard.csv
|    ├── dashboard.css
|    └── login.css
├── templates
│   ├── export_dash.html
│   ├── index.html
│   └── prog_report.html
├── main.py
├── README.md
└── requirements.txt   
```
