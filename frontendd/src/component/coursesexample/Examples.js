import React, { useState } from "react";
import courseData from "./example.json";
import "./example.css";

const CoursePlayer = () => {
  const [selectedLesson, setSelectedLesson] = useState(courseData.lessons[0]);

  return (
    <div className="course-player">
      <h2>{courseData.title}</h2>
      <p>{courseData.description}</p>

      <div className="player-container">
        <div className="video-section">
          <h3 className="video-title">
            {selectedLesson.title} <span className="duration">({selectedLesson.duration})</span>
          </h3>
          <iframe
            width="100%"
            height="400"
            src={selectedLesson.videoUrl.replace("watch?v=", "embed/")}
            title={selectedLesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <p className="video-description">{selectedLesson.description}</p>
        </div>

        <div className="lesson-list">
          <h4>Lessons</h4>
          <ul>
            {courseData.lessons.map((lesson) => (
              <li
                key={lesson.lessonId}
                className={lesson.lessonId === selectedLesson.lessonId ? "active" : ""}
                onClick={() => setSelectedLesson(lesson)}
              >
                {lesson.title} <span className="duration">({lesson.duration})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
