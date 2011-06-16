require 'spec_helper'

describe "textures/new.html.haml" do
  before(:each) do
    assign(:texture, stub_model(Texture).as_new_record)
  end

  it "renders new texture form" do
    render

    rendered.should have_selector("form", :action => textures_path, :method => "post") do |form|
    end
  end
end
