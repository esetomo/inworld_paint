require 'spec_helper'

describe "textures/index.html.haml" do
  before(:each) do
    assign(:canvas, stub_model(Canvas))
    assign(:textures, [
      stub_model(Texture),
      stub_model(Texture)
    ])
  end

  it "renders a list of textures" do
    render
  end
end
