require 'spec_helper'

describe "textures/edit.html.haml" do
  before(:each) do
    @texture = assign(:texture, stub_model(Texture))
  end

  it "renders the edit texture form" do
    render

    rendered.should have_selector("form", :action => texture_path(@texture), :method => "post") do |form|
    end
  end
end
