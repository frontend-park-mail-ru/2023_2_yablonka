sudo cp /home/vfomenko/Programming/Technopark/Frontend/ProjectTrello/front-end/2023_2_yablonka/nginx/tabula.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/tabula.conf
sudo ln -s /etc/nginx/sites-available/tabula.conf /etc/nginx/sites-enabled/
sudo systemctl restart nginx
