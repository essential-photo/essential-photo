namespace :users do
  desc "Seeds dev admin"
  task seed_admin: :environment do
    Admin.create(email: 'test@mail.com', password: 'password') 
    p "Created #{Admin.count} users"
  end
end