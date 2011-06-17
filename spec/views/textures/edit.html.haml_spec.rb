require 'spec_helper'

describe "textures/edit.html.haml" do
  before(:each) do
    @canvas = assign(:canvas, stub_model(Canvas))
    @texture = assign(:texture, stub_model(Texture))
  end

  it "renders the edit texture form" do
    render

    rendered.should have_selector("form", :action => canvas_texture_path(@canvas, @texture), :method => "post") do |form|
    end
  end
end
