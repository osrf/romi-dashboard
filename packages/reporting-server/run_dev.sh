#!/bin/bash
migrations=$(aerich heads) 
if [[ $migrations != "No available heads,try migrate first" ]]
  then
    aerich heads
    echo -n "You have unapply migrations, do you want to apply it (y/n)"
    read answer
    if [ "$answer" != "${answer#[Yy]}" ] ;then
        npm run apply:migrations
    else
        echo "Migrations were not applied"
    fi
  else
    echo "Migrations are up to date"
fi
