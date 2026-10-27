import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("muestra el valor recibido por props", () => {
    render(<SearchBar valor="mouse" onChange={() => {}} />);
    expect(screen.getByLabelText("Buscar producto").value).toBe("mouse");
  });

  it("avisa con onChange el texto que escribe el usuario (evento)", () => {
    const onChange = jasmine.createSpy("onChange");
    render(<SearchBar valor="" onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Buscar producto"), { target: { value: "monitor" } });
    expect(onChange).toHaveBeenCalledWith("monitor");
  });
});
