require 'spec_helper'

describe "textures/new.html.haml" do
  before(:each) do
    @canvas = assign(:canvas, stub_model(Canvas))
    assign(:texture, stub_model(Texture).as_new_record)
  end

  it "renders new texture form" do
    render

    rendered.should have_selector("form", :action => canvas_textures_path(@canvas), :method => "post") do |form|
    end
  end
end
