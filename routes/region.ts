/** @module routes/region */
import * as Express from "express";
import * as Model from "../lib/model";
import { Region, RegionHelper } from "../lib/region";
import * as Util from "../lib/util";

var router: Express.Router = Express.Router();

router.get("/:id", function (req, res) {
	var id = req.params.id;

	if (!Util.isPositiveInt(id)) {
		return res.status(400).json(new Model.Base(false, "Invalid ID"));
	}

	RegionHelper.getById(id)
		.then((region: Region) => {
			return res.json(new Model.Region({
				id: region.id,
				name: region.name
			}));
		})
		.catch((err: any) => {
			return res.status(500).json(new Model.Base(false, err));
		});
});

export default router;