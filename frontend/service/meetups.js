import { supabase } from "./supabaseClient.js";

export async function getMeetUp(swap_id) {
    const {data: meetUpData, error: meetUpError} = await supabase
        .from('MeetUps')
        .select('*')
        .eq('swap_id', swap_id);
    if (meetUpError) {
        // console.log(`Error getting meet up for ${swap_id}`, error);
        return null;
    } else {
        console.log(`Successfully got meet up data for ${swap_id}`);
        return meetUpData;
    }
}

export async function updateMeetUp(swap_id, new_location, new_date, new_time) {
    // console.log("adding to meetup db: ", new_location, new_date, new_time)
    const {error} = await supabase
        .from('MeetUps')
        .update({location: new_location, date: new_date, time: new_time})
        .eq('swap_id', swap_id);
    if (error) {
        console.log(`Error updating meet up for ${swap_id}`, error);
    } else {
        console.log(`Successfully updated meet up for ${swap_id}`);
    }
}

(async () => {
    const swap_id = "3";
    const location = "new york";
    const new_date = '2024-10-08';
    const new_time = "13:02";
    await updateMeetUp(swap_id, location, new_date, new_time);
})();