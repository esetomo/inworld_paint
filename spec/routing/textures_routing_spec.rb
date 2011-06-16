require "spec_helper"

describe TexturesController do
  describe "routing" do

    it "routes to #index" do
      get("/textures").should route_to("textures#index")
    end

    it "routes to #new" do
      get("/textures/new").should route_to("textures#new")
    end

    it "routes to #show" do
      get("/textures/1").should route_to("textures#show", :id => "1")
    end

    it "routes to #edit" do
      get("/textures/1/edit").should route_to("textures#edit", :id => "1")
    end

    it "routes to #create" do
      post("/textures").should route_to("textures#create")
    end

    it "routes to #update" do
      put("/textures/1").should route_to("textures#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/textures/1").should route_to("textures#destroy", :id => "1")
    end

  end
end
