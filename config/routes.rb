Rails.application.routes.draw do
  root to: 'frontend#index'

  # all api requests
  namespace :api do 
    namespace :v1 do 
      mount_devise_token_auth_for 'Admin', at: 'auth'
      resources :images, only: [:index, :create, :update]
      resources :albums, only: [:index, :create, :update]
    end
  end

  # let everything else be handled by the frontend, with the 
  # exception of active storage
  get '/*path', to: 'frontend#index', constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
