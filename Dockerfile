# Use an official Nginx runtime as a parent image
FROM nginx:alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static files from the local directory to the Nginx webroot
COPY index.html /usr/share/nginx/html/
COPY static/ /usr/share/nginx/html/static/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
