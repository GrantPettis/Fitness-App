/* loading screen for the exercise page. Can be applied to other pages*/

import classes from '@/app/components/loading.module.css'
export default function ExerciseLoading (){
    return <h1 className= {classes.loading}> Loading Exercise</h1>
}