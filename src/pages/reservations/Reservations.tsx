import { Form } from "react-router-dom";

export const Reservations = () => {
  return (
    <div>
      <h1>Rezervacija karte</h1>

      <Form>
        <div>
          <div>
            <label htmlFor="name">Unesite svoje prezime i ime</label>
          </div>
          <div>
            <input type="text" id="name" />
          </div>

          <div>
            <div>
              <label htmlFor="startingLocation">Izaberite mesto polaska</label>
            </div>
            <select name="startingLocation" id="startingLocation">
              <option value="" disabled>
                Izaberite grad
              </option>
              <option value="krusevac">Kruševac</option>
              <option value="beograd">Beograd</option>
            </select>
          </div>
        </div>
      </Form>
    </div>
  );
};
