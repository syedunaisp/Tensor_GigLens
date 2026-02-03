"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Award, BookOpen } from "lucide-react";
import { Course } from "@/data/courses";
import { useLanguage } from "@/context/LanguageContext";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const { language, t } = useLanguage();

    const getTitle = () => {
        if (language === 'hi') return course.titleHi;
        if (language === 'te') return course.titleTe;
        return course.title;
    };

    const getDescription = () => {
        if (language === 'hi') return course.descriptionHi;
        if (language === 'te') return course.descriptionTe;
        return course.description;
    };

    const handleViewCourse = () => {
        window.open(course.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <h4 className="font-semibold text-sm truncate">{getTitle()}</h4>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {getDescription()}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {course.provider}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                            {course.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge 
                            variant={course.type === 'free' ? 'default' : 'outline'}
                            className={course.type === 'free' 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'border-orange-500 text-orange-600'
                            }
                        >
                            {course.type === 'free' 
                                ? (language === 'hi' ? 'मुफ्त' : language === 'te' ? 'ఉచితం' : 'Free')
                                : course.price
                            }
                        </Badge>
                        
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-7 gap-1"
                            onClick={handleViewCourse}
                        >
                            {t.view_course}
                            <ExternalLink className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
