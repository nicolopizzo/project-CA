import { POI } from "../../models/poi.model";

export class UserPOIRequest {
    username: string;
  }

export class UserPOIResponse {
    POIs: POI[];
}

export class AddUserPOI {
  username: string;
  poi: POI;
}