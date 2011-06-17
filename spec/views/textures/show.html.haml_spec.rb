require 'spec_helper'

describe "textures/show.html.haml" do
  before(:each) do
    @canvas = assign(:canvas, stub_model(Canvas))
    @texture = assign(:texture, stub_model(Texture))
  end

  it "renders attributes in <p>" do
    render
  end
end
