# General Information
A system designed to optimize the asset's performance by ensuring all assets are well maintained. The system has an inventory and spare part management module to ensure the availability of spare parts needed. It has an employee management module to help improve workforce productivity.



# Technology Used

This project was built using Python Django REST framework for backend and ReactJS for frontend and uses the following technologies:

- Django==4.1.5 - Python web framework.
- django-cors-headers==3.13.0 - Cross-Origin Resource Sharing (CORS).
- djangorestframework==3.14.0 - Toolkit for building Web APIs.
- djangorestframework-simplejwt==5.2.2 - For backend authentication.
- antd==4.24.2 - React UI library.
- axios==1.1.3 - HTTP client library.
- react==18.2.0 - Frontend JavaScript library.



# Features

## Corrective Or Preventive Maintenance Scheduling

The system determines what type of maintenance to perform whether corrective or preventive to keep the assets in good operating condition for safety, reliability, and longevity.

Corrective Maintenance is a type of maintenance task or action is usually performed after equipment failure. It is simply considered as all activities that restore failed or broken-down assets to its normal working condition. It is reactive in nature. Whenever any assets fail, either it is replaced, repaired, or restored to its operability.

Preventive Maintenance is a type of maintenance task or action that is usually performed before equipment failure. It is simply considered as all activities that maintain assets and prevent them from failure or breakdown. It is preventive in nature.

## Asset Management

Create and update asset's information, control, organize, and coordinate assets to optimize operations.

## Spare Parts Inventory

It has a complete and integrated inventory management module. Whenever asset comes in for maintenance, the technicians can see which tools they need and whether they are available or not. Whenever an item is taken from the inventory, it is automatically recorded to calculate the cost per maintained vehicle.

## Employee Management

Improve daily productivity by monitoring the number of available employees for operation. Manage employee information, vacations, attendances, and absences.

## Reports

Generate reports to monitor work order status, employee productivity, spare part consumption, out-of-service assets, and road call assets.



# Screenshots

![This is an image](https://github.com/jadedanial/danialsoftams/blob/main/ui1.png)

![This is an image](https://github.com/jadedanial/danialsoftams/blob/main/ui2.png)



# Setup

Follow the steps below to get started with this project's development environment.

1. Install frameworks and libraries using pip3
   - pip3 install django==4.1.5
   - pip3 install django-cors-headers
   - pip3 install djangorestframework
   - pip3 install djangorestframework-simplejwt

2. Download and install Node.JS and NPM

3. Install ReactJS using npm package manager by using the command:
   - npm install -g create-react-app

4. Navigate to backend directory and run server by using the command:
   - python manage.py runserver localhost:8000

5. Navigate to frontend/ams directory and run react app by using the command:
   - npm start



# Project Status

Project is in progress.



# Contact

Created by [@jadedanial](http://jadedanial.com/) - feel free to contact me!